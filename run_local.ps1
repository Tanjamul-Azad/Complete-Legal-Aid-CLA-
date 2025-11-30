<#
Complete Legal Aid - Windows Local Setup & Run Script
This PowerShell script mirrors the behavior of run_local.sh for Windows users.
It installs prerequisites, prepares environments, and launches both servers.
#>

$ErrorActionPreference = "Stop"

$script:BackendProcess = $null
$script:FrontendProcess = $null
$script:PythonExecutable = $null
$script:ServersStarted = $false

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $ScriptDir "Backend"
$FrontendDir = Join-Path $ScriptDir "Frontend"
$VenvDir = Join-Path $BackendDir "venv"
$VenvPython = Join-Path $VenvDir "Scripts\python.exe"
$BackendPidFile = Join-Path $ScriptDir ".backend.pid"
$FrontendPidFile = Join-Path $ScriptDir ".frontend.pid"

function Write-Color {
    param(
        [string]$Message,
        [ConsoleColor]$Color = [ConsoleColor]::White
    )

    Write-Host $Message -ForegroundColor $Color
}

function Write-Section {
    param([string]$Title)

    Write-Host ""
    Write-Color "==========================================" Cyan
    Write-Color $Title Cyan
    Write-Color "==========================================" Cyan
    Write-Host ""
}

function Show-Help {
    @"
Complete Legal Aid - Local Setup & Run (PowerShell)

Usage: .\run_local.ps1 [options]

Options:
    --setup-only        Only run setup without starting servers
    --backend-only      Only start the backend server
    --frontend-only     Only start the frontend server
    --skip-setup        Skip setup steps and only run servers
    --help              Show this help text

Examples:
    .\run_local.ps1                  # Setup and start both servers
    .\run_local.ps1 --setup-only     # Run setup only
    .\run_local.ps1 --backend-only   # Setup and start backend only
    .\run_local.ps1 --skip-setup     # Start servers without setup
"@ | Write-Host
}

function Resolve-PythonExecutable {
    $pyLauncher = Get-Command py -ErrorAction SilentlyContinue
    if ($pyLauncher) {
        try {
            $exe = & py -3 -c "import sys; print(sys.executable)"
            if ($exe) { return $exe.Trim() }
        } catch {
        }
    }

    foreach ($candidate in @("python", "python3")) {
        $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($cmd) { return $cmd.Source }
    }

    return $null
}

function Test-CommandExists {
    param([string]$Command)
    return [bool](Get-Command $Command -ErrorAction SilentlyContinue)
}

function Check-Prerequisites {
    Write-Section "Checking Prerequisites"

    $missing = $false

    $script:PythonExecutable = Resolve-PythonExecutable
    if ($script:PythonExecutable) {
        $version = & $script:PythonExecutable -c "import platform; print(platform.python_version())"
        Write-Color "✓ Python found: $version" Green
    } else {
        Write-Color "✗ Python 3.10+ not found. Install from https://www.python.org/downloads/" Red
        $missing = $true
    }

    if (Test-CommandExists "node") {
        $nodeVersion = (& node --version)
        Write-Color "✓ Node.js found: $nodeVersion" Green
    } else {
        Write-Color "✗ Node.js 18+ not found. Install from https://nodejs.org/" Red
        $missing = $true
    }

    if (Test-CommandExists "npm") {
        $npmVersion = (& npm --version)
        Write-Color "✓ npm found: $npmVersion" Green
    } else {
        Write-Color "✗ npm not found. It ships with Node.js; reinstall Node.js." Red
        $missing = $true
    }

    if (Test-CommandExists "mysql") {
        $mysqlVersion = (& mysql --version)
        Write-Color "✓ MySQL client found: $mysqlVersion" Green
    } else {
        Write-Color "⚠ MySQL not detected. Install and ensure the service is running." Yellow
    }

    if ($missing) {
        throw "Missing prerequisites. Install the components above and rerun the script."
    }

    Write-Color "All required prerequisites detected." Green
}

function Ensure-BackendPaths {
    if (-not (Test-Path $BackendDir)) {
        throw "Backend directory not found at $BackendDir"
    }
}

function Ensure-FrontendPaths {
    if (-not (Test-Path $FrontendDir)) {
        throw "Frontend directory not found at $FrontendDir"
    }
}

function Invoke-VenvPython {
    param(
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    & $VenvPython @Arguments
}

function Setup-Backend {
    Write-Section "Setting Up Backend"
    Ensure-BackendPaths

    if (-not (Test-Path $VenvDir)) {
        Write-Color "Creating Python virtual environment..." Yellow
        & $script:PythonExecutable -m venv $VenvDir
        Write-Color "Virtual environment created." Green
    } else {
        Write-Color "Virtual environment already exists." Green
    }

    if (-not (Test-Path $VenvPython)) {
        throw "Virtual environment is missing python.exe at $VenvPython"
    }

    Write-Color "Upgrading pip..." Yellow
    Invoke-VenvPython -Arguments @("-m", "pip", "install", "--upgrade", "pip", "--quiet")

    $requirementsPath = Join-Path $BackendDir "requirements.txt"
    if (-not (Test-Path $requirementsPath)) {
        throw "requirements.txt not found in Backend directory."
    }

    Write-Color "Installing Python dependencies..." Yellow
    Invoke-VenvPython -Arguments @("-m", "pip", "install", "-r", "requirements.txt")
    Write-Color "Python dependencies installed." Green

    Push-Location $BackendDir
    try {
        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Write-Color "Creating .env from .env.example..." Yellow
                Copy-Item ".env.example" ".env"
                Write-Color "Update Backend/.env with your database credentials." Yellow
            } else {
                throw ".env.example not found; cannot create .env"
            }
        } else {
            Write-Color ".env file detected." Green
        }

        Test-DatabaseConnection

        Write-Color "Running database migrations..." Yellow
        Invoke-VenvPython -Arguments @("manage.py", "migrate", "--noinput")
        Write-Color "Migrations applied." Green

        Write-Color "Checking for superuser..." Yellow
        Invoke-VenvPython -Arguments @("manage.py", "shell", "--command", "from api.models import User; import sys; sys.exit(0 if User.objects.filter(is_superuser=True).exists() else 1)")
        if ($LASTEXITCODE -ne 0) {
            Write-Color "Creating default superuser..." Yellow
            Invoke-VenvPython -Arguments @("create_superuser.py")
        } else {
            Write-Color "Superuser already exists." Green
        }
    }
    finally {
        Pop-Location
    }

    Write-Color "Backend setup complete." Green
}

function Test-DatabaseConnection {
    Write-Color "Verifying database connectivity..." Yellow
    $dbScript = @'
import os
from dotenv import load_dotenv
import pymysql

load_dotenv()
conn = pymysql.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", "12345678")
)
conn.close()
'@
    try {
        Invoke-VenvPython -Arguments @("-c", $dbScript) | Out-Null
        Write-Color "Database connection successful." Green
    } catch {
        Write-Color "Database connection failed. Attempting to run create_db.py..." Yellow
        try {
            Invoke-VenvPython -Arguments @("create_db.py")
        } catch {
            Write-Color "Database setup may require manual intervention." Yellow
        }
    }
}

function Setup-Frontend {
    Write-Section "Setting Up Frontend"
    Ensure-FrontendPaths

    Push-Location $FrontendDir
    try {
        if (-not (Test-Path "node_modules")) {
            Write-Color "Installing Node dependencies (this may take a moment)..." Yellow
            npm install
        } else {
            Write-Color "node_modules already present. Running npm install to ensure parity..." Yellow
            npm install
        }

        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Write-Color "Creating Frontend .env from .env.example..." Yellow
                Copy-Item ".env.example" ".env"
                Write-Color "Update Frontend/.env with the correct API URL." Yellow
            } else {
                throw "Frontend .env.example not found."
            }
        } else {
            Write-Color "Frontend .env file detected." Green
        }
    }
    finally {
        Pop-Location
    }

    Write-Color "Frontend setup complete." Green
}

function Stop-PortProcess {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid in $pids) {
            try {
                Write-Color "Stopping process $pid on port $Port..." Yellow
                Stop-Process -Id $pid -Force -ErrorAction Stop
            } catch {
                Write-Color "Unable to stop process $pid on port $Port." Yellow
            }
        }
        Start-Sleep -Seconds 1
    }
}

function Start-Backend {
    Write-Section "Starting Backend Server"
    Ensure-BackendPaths

    Stop-PortProcess -Port 8000

    $arguments = @("manage.py", "runserver")
    $script:BackendProcess = Start-Process -FilePath $VenvPython -ArgumentList $arguments -WorkingDirectory $BackendDir -NoNewWindow -PassThru
    Set-Content -Path $BackendPidFile -Value $script:BackendProcess.Id

    Write-Color "Backend server starting on http://localhost:8000" Green
    Wait-ForBackend
}

function Wait-ForBackend {
    Write-Color "Waiting for backend to respond..." Yellow
    for ($i = 0; $i -lt 30; $i++) {
        try {
            Invoke-WebRequest -Uri "http://localhost:8000/api/" -UseBasicParsing -TimeoutSec 2 | Out-Null
            Write-Color "Backend is online." Green
            return
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    Write-Color "Backend did not respond within 30 seconds." Yellow
}

function Start-Frontend {
    Write-Section "Starting Frontend Server"
    Ensure-FrontendPaths

    Stop-PortProcess -Port 3000

    $script:FrontendProcess = Start-Process -FilePath "npm" -ArgumentList @("run", "dev") -WorkingDirectory $FrontendDir -NoNewWindow -PassThru
    Set-Content -Path $FrontendPidFile -Value $script:FrontendProcess.Id
    Write-Color "Frontend server starting on http://localhost:3000" Green

    Write-Color "Waiting 5 seconds for frontend to compile..." Yellow
    Start-Sleep -Seconds 5
}

function Stop-Servers {
    Write-Section "Shutting Down Servers"

    if (Test-Path $BackendPidFile) { Remove-Item $BackendPidFile -ErrorAction SilentlyContinue }
    if (Test-Path $FrontendPidFile) { Remove-Item $FrontendPidFile -ErrorAction SilentlyContinue }

    if ($script:BackendProcess -and -not $script:BackendProcess.HasExited) {
        try {
            Write-Color "Stopping backend server (PID $($script:BackendProcess.Id))..." Yellow
            $script:BackendProcess.Kill()
            $script:BackendProcess.WaitForExit()
        } catch {
            Write-Color "Failed to stop backend server gracefully." Yellow
        }
    }

    if ($script:FrontendProcess -and -not $script:FrontendProcess.HasExited) {
        try {
            Write-Color "Stopping frontend server (PID $($script:FrontendProcess.Id))..." Yellow
            $script:FrontendProcess.Kill()
            $script:FrontendProcess.WaitForExit()
        } catch {
            Write-Color "Failed to stop frontend server gracefully." Yellow
        }
    }

    Stop-PortProcess -Port 8000
    Stop-PortProcess -Port 3000

    Write-Color "All servers stopped." Green
}

function Parse-Arguments {
    param([string[]]$Arguments)

    $parsed = [ordered]@{
        SetupOnly = $false
        BackendOnly = $false
        FrontendOnly = $false
        SkipSetup = $false
    }

    foreach ($arg in $Arguments) {
        switch ($arg.ToLowerInvariant()) {
            "--setup-only" { $parsed.SetupOnly = $true }
            "--backend-only" { $parsed.BackendOnly = $true }
            "--frontend-only" { $parsed.FrontendOnly = $true }
            "--skip-setup" { $parsed.SkipSetup = $true }
            "--help" {
                Show-Help
                exit 0
            }
            default {
                throw "Unknown option: $arg"
            }
        }
    }

    if ($parsed.BackendOnly -and $parsed.FrontendOnly) {
        throw "Use either --backend-only or --frontend-only, not both."
    }

    return $parsed
}

function Show-SuccessSummary {
    Write-Section "Complete Legal Aid is Running"
    Write-Color "Backend API:   http://localhost:8000/api/" Green
    Write-Color "Admin Panel:   http://localhost:8000/admin/" Green
    if (-not $Options.BackendOnly) {
        Write-Color "Frontend App: http://localhost:3000" Green
    }
    Write-Host ""
    Write-Color "Default Credentials:" Yellow
    Write-Color "  Email:    ahbab.md@gmail.com" Yellow
    Write-Color "  Password: ahbab2018" Yellow
    Write-Host ""
    Write-Color "Press Ctrl+C to stop servers." Cyan
}

$Options = Parse-Arguments -Arguments $args

Write-Section "Complete Legal Aid - Local Setup & Run"
Write-Color "Starting automated setup and deployment..." Green

Check-Prerequisites

if (-not $Options.SkipSetup) {
    if (-not $Options.FrontendOnly) {
        Setup-Backend
    }

    if (-not $Options.BackendOnly) {
        Setup-Frontend
    }
} else {
    Write-Color "Skipping setup phase per request..." Yellow
}

if ($Options.SetupOnly) {
    Write-Color "Setup complete. Re-run without --setup-only to start servers." Green
    exit 0
}

try {
    if (-not $Options.FrontendOnly) {
        Start-Backend
    }

    if (-not $Options.BackendOnly) {
        Start-Frontend
    }

    $script:ServersStarted = $true
    Show-SuccessSummary

    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    if ($script:ServersStarted) {
        Stop-Servers
    }
}
