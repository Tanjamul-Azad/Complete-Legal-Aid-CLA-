#!/usr/bin/env python3
"""Cross-platform helper to setup and run Complete Legal Aid locally."""
from __future__ import annotations

import argparse
import os
import shutil
import signal
import socket
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

# Basic ANSI color support (auto-disabled on Windows console without VT)
ANSI_COLORS = {
    "blue": "\033[0;34m",
    "green": "\033[0;32m",
    "yellow": "\033[1;33m",
    "red": "\033[0;31m",
    "dim": "\033[2m",
    "reset": "\033[0m",
}


def supports_color() -> bool:
    if os.name != "nt":
        return sys.stdout.isatty()
    return sys.stdout.isatty() and os.environ.get("WT_SESSION") is not None


COLOR_ENABLED = supports_color()
NODE_CMD: Optional[str] = None
NPM_CMD: Optional[str] = None


def colorize(text: str, color: str) -> str:
    if not COLOR_ENABLED or color not in ANSI_COLORS:
        return text
    return f"{ANSI_COLORS[color]}{text}{ANSI_COLORS['reset']}"


def print_step(message: str) -> None:
    print("\n" + colorize(f"=== {message} ===", "blue"))


def print_info(message: str) -> None:
    print(colorize(message, "green"))


def print_warn(message: str) -> None:
    print(colorize(message, "yellow"))


def print_error(message: str) -> None:
    print(colorize(message, "red"))


def run_command(cmd: List[str], *, cwd: Optional[Path] = None) -> None:
    pretty = " ".join(cmd)
    print(colorize(f"$ {pretty}", "dim"))
    subprocess.run(cmd, cwd=str(cwd) if cwd else None, check=True)


def ensure_command_exists(name: str, help_text: str) -> None:
    if shutil.which(name):
        return
    raise RuntimeError(f"{name} is required. {help_text}")


def check_prerequisites() -> None:
    print_step("Checking prerequisites")
    if sys.version_info[:2] < (3, 10):
        raise RuntimeError("Python 3.10+ is required to run this script")
    global NODE_CMD, NPM_CMD
    node_cmd = shutil.which("node")
    if not node_cmd:
        raise RuntimeError("Node.js 18+ is required. Install from https://nodejs.org/")
    npm_cmd = shutil.which("npm")
    if not npm_cmd:
        raise RuntimeError("npm (bundled with Node.js) is required. Make sure Node is installed and added to PATH.")
    NODE_CMD, NPM_CMD = node_cmd, npm_cmd
    mysql_cli = shutil.which("mysql")
    if not mysql_cli:
        print_warn(
            "MySQL command-line client not found in PATH. Continuing, but make sure your MySQL server is installed, running, and accessible."
        )
    else:
        print_info(f"MySQL:  {subprocess.check_output([mysql_cli, '--version']).decode().strip()}")
    print_info(f"Python: {sys.executable}")
    print_info(f"Node:   {subprocess.check_output([node_cmd, '--version']).decode().strip()}")
    print_info(f"npm:    {subprocess.check_output([npm_cmd, '--version']).decode().strip()}")
    os.environ.setdefault("PATH", "")
    for tool in (node_cmd, npm_cmd):
        tool_dir = str(Path(tool).parent)
        if tool_dir not in os.environ["PATH"]:
            os.environ["PATH"] = f"{tool_dir}{os.pathsep}{os.environ['PATH']}"


def ensure_dotenv(directory: Path) -> None:
    env_file = directory / ".env"
    template = directory / ".env.example"
    if env_file.exists():
        print_info(f".env already present in {directory}")
        return
    if template.exists():
        shutil.copy(template, env_file)
        print_warn(f"Created {env_file}. Please review and update credentials as needed.")
    else:
        print_warn(f"No .env or .env.example found in {directory}.")


def locate_venv_python(venv_dir: Path) -> Optional[Path]:
    candidates = [
        venv_dir / "Scripts" / "python.exe",
        venv_dir / "Scripts" / "python",
        venv_dir / "bin" / "python3",
        venv_dir / "bin" / "python",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def ensure_virtualenv(base_python: str, venv_dir: Path) -> Path:
    if not venv_dir.exists():
        print_info("Creating Python virtual environment...")
        run_command([base_python, "-m", "venv", str(venv_dir)])
    venv_python = locate_venv_python(venv_dir)
    if not venv_python:
        raise RuntimeError(f"Failed to find Python inside {venv_dir}")
    return venv_python


def check_database_connection(backend_dir: Path, venv_python: Path) -> None:
    print_info("Checking database connectivity...")
    code = (
        "from dotenv import load_dotenv; load_dotenv();"
        "import os, pymysql;"
        "conn = pymysql.connect(host=os.getenv('DB_HOST','localhost'), "
        "user=os.getenv('DB_USER','root'), password=os.getenv('DB_PASSWORD','12345678'), "
        "port=int(os.getenv('DB_PORT',3306))); conn.close()"
    )
    try:
        subprocess.run(
            [str(venv_python), "-c", code],
            cwd=str(backend_dir),
            check=True,
            capture_output=True,
        )
        print_info("Database connection successful.")
    except subprocess.CalledProcessError as exc:
        print_warn("Database connection failed. Attempting to run create_db.py ...")
        try:
            run_command([str(venv_python), "create_db.py"], cwd=backend_dir)
        except subprocess.CalledProcessError:
            raise RuntimeError("Unable to connect to database. Please verify credentials and rerun.") from exc


def ensure_superuser(backend_dir: Path, venv_python: Path) -> None:
    cmd = [
        str(venv_python),
        "manage.py",
        "shell",
        "--command",
        "import sys; from api.models import User; sys.exit(0 if User.objects.filter(is_superuser=True).exists() else 1)",
    ]
    result = subprocess.run(cmd, cwd=str(backend_dir))
    if result.returncode == 0:
        print_info("Superuser already exists.")
        return
    print_warn("Superuser not found. Running create_superuser.py ...")
    try:
        run_command([str(venv_python), "create_superuser.py"], cwd=backend_dir)
    except subprocess.CalledProcessError:
        print_warn("Superuser creation script failed. You may need to create one manually.")


def setup_backend(backend_dir: Path, base_python: str) -> Path:
    print_step("Setting up backend")
    venv_dir = backend_dir / "venv"
    venv_python = ensure_virtualenv(base_python, venv_dir)
    run_command([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], cwd=backend_dir)
    requirements = backend_dir / "requirements.txt"
    if not requirements.exists():
        raise RuntimeError("Backend/requirements.txt not found")
    run_command([str(venv_python), "-m", "pip", "install", "-r", str(requirements)], cwd=backend_dir)
    ensure_dotenv(backend_dir)
    check_database_connection(backend_dir, venv_python)
    run_command([str(venv_python), "manage.py", "migrate", "--noinput"], cwd=backend_dir)
    ensure_superuser(backend_dir, venv_python)
    return venv_python


def setup_frontend(frontend_dir: Path) -> None:
    print_step("Setting up frontend")
    npm_exec = NPM_CMD or shutil.which("npm") or "npm"
    run_command([npm_exec, "install"], cwd=frontend_dir)
    ensure_dotenv(frontend_dir)


def wait_for_port(port: int, label: str, timeout: int = 30) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)
            try:
                sock.connect(("127.0.0.1", port))
                print_info(f"{label} is responding on port {port}.")
                return
            except OSError:
                time.sleep(1)
    print_warn(f"{label} did not respond on port {port} within {timeout} seconds.")


@dataclass
class ManagedProcess:
    name: str
    process: subprocess.Popen
    thread: threading.Thread

    @classmethod
    def start(cls, name: str, cmd: List[str], cwd: Path) -> "ManagedProcess":
        popen = subprocess.Popen(
            cmd,
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        thread = threading.Thread(target=cls._pump, args=(name, popen), daemon=True)
        thread.start()
        return cls(name=name, process=popen, thread=thread)

    @staticmethod
    def _pump(name: str, proc: subprocess.Popen) -> None:
        assert proc.stdout is not None
        for line in proc.stdout:
            line = line.rstrip()
            if not line:
                continue
            prefix = "[BACKEND]" if name == "backend" else "[FRONTEND]"
            color = "green" if name == "backend" else "blue"
            print(colorize(f"{prefix} {line}", color))
        proc.stdout.close()

    def stop(self) -> None:
        if self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.process.kill()
        if self.thread.is_alive():
            self.thread.join(timeout=2)


def start_backend(backend_dir: Path, venv_python: Path, port: int) -> ManagedProcess:
    print_step("Starting backend server")
    cmd = [str(venv_python), "manage.py", "runserver", f"0.0.0.0:{port}"]
    proc = ManagedProcess.start("backend", cmd, backend_dir)
    wait_for_port(port, "Backend")
    return proc


def start_frontend(frontend_dir: Path, port: int) -> ManagedProcess:
    print_step("Starting frontend server")
    npm_exec = NPM_CMD or shutil.which("npm") or "npm"
    cmd = [npm_exec, "run", "dev", "--", "--host", "0.0.0.0", "--port", str(port)]
    proc = ManagedProcess.start("frontend", cmd, frontend_dir)
    wait_for_port(port, "Frontend")
    return proc


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Setup and run both backend and frontend servers.")
    parser.add_argument("--setup-only", action="store_true", help="Run setup steps without starting servers")
    parser.add_argument("--backend-only", action="store_true", help="Only start the backend server")
    parser.add_argument("--frontend-only", action="store_true", help="Only start the frontend server")
    parser.add_argument("--skip-setup", action="store_true", help="Skip setup phase and start servers directly")
    parser.add_argument("--backend-port", type=int, default=8000, help="Port for Django dev server (default: 8000)")
    parser.add_argument("--frontend-port", type=int, default=3000, help="Port for Vite dev server (default: 3000)")
    parser.add_argument("--python", default=sys.executable, help="Python executable to use for creating the virtualenv")
    args = parser.parse_args()
    if args.backend_only and args.frontend_only:
        parser.error("--backend-only and --frontend-only cannot be used together")
    if args.backend_port == args.frontend_port and not (args.backend_only or args.frontend_only):
        parser.error("Backend and frontend ports must differ")
    return args


def main() -> None:
    args = parse_args()
    project_root = Path(__file__).resolve().parent
    backend_dir = project_root / "Backend"
    frontend_dir = project_root / "Frontend"

    if not backend_dir.exists() or not frontend_dir.exists():
        raise SystemExit("Backend/ or Frontend/ directories could not be found next to run.py")

    check_prerequisites()

    venv_python: Optional[Path] = None
    if not args.frontend_only:
        if args.skip_setup:
            venv_python = locate_venv_python(backend_dir / "venv")
            if not venv_python:
                raise RuntimeError("Virtual environment missing. Run without --skip-setup first.")
        else:
            venv_python = setup_backend(backend_dir, args.python)

    if not args.backend_only and not args.skip_setup:
        setup_frontend(frontend_dir)

    if args.setup_only:
        print_info("Setup finished. Run again without --setup-only to start the servers.")
        return

    processes: List[ManagedProcess] = []
    try:
        if not args.frontend_only:
            assert venv_python is not None
            processes.append(start_backend(backend_dir, venv_python, args.backend_port))
        if not args.backend_only:
            processes.append(start_frontend(frontend_dir, args.frontend_port))
        if not processes:
            print_warn("Nothing to run. Use default options or drop --backend-only/--frontend-only flags.")
            return
        print_step("Complete Legal Aid is running")
        print_info(f"Backend API:  http://localhost:{args.backend_port}/api/")
        print_info(f"Admin Panel: http://localhost:{args.backend_port}/admin/")
        if not args.backend_only:
            print_info(f"Frontend:    http://localhost:{args.frontend_port}")
        print_warn("Press Ctrl+C to stop both servers.")

        # Keep the main thread alive while subprocesses run
        while True:
            time.sleep(0.5)
            for proc in list(processes):
                if proc.process.poll() is not None:
                    raise RuntimeError(f"{proc.name.capitalize()} server stopped unexpectedly.")
    except KeyboardInterrupt:
        print_warn("\nStopping servers...")
    finally:
        for proc in processes:
            proc.stop()


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as exc:
        print_error(str(exc))
        sys.exit(1)
    except subprocess.CalledProcessError as exc:
        print_error(f"Command failed with exit code {exc.returncode}")
        sys.exit(exc.returncode)
