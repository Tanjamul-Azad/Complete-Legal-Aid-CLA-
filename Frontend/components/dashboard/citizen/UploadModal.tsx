import React, { useState, useEffect } from 'react';
import { UploadIcon, FolderLockIcon, BriefcaseIcon, CloseIcon, CheckCircleIcon } from '../../icons';
import type { Case, User } from '../../../types';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, option: 'vault' | 'case', caseId?: string) => void;
    cases: Case[];
    users: User[]; // To find lawyer name
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, cases, users }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadOption, setUploadOption] = useState<'vault' | 'case'>('vault');
    const [selectedCaseId, setSelectedCaseId] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFile(null);
            setUploadOption('vault');
            setSelectedCaseId('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!file) return;
        if (uploadOption === 'case' && !selectedCaseId) return;

        onUpload(file, uploadOption, selectedCaseId);
        onClose();
    };

    const selectedCase = cases.find(c => c.id === selectedCaseId);
    const assignedLawyer = selectedCase ? users.find(u => u.id === selectedCase.lawyerId) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-white/10 animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#151515]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UploadIcon className="w-5 h-5 text-cla-gold" />
                        Upload Document
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Step 1: File Selection */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? 'border-cla-gold bg-cla-gold/5' : 'border-gray-300 dark:border-gray-700 hover:border-cla-gold/50'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-500">
                                <CheckCircleIcon className="w-6 h-6" />
                                <span className="font-medium truncate max-w-[250px]">{file.name}</span>
                                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline ml-2">Change</button>
                            </div>
                        ) : (
                            <>
                                <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Drag & drop your file here</p>
                                <p className="text-xs text-gray-400 mt-1">or</p>
                                <label className="mt-3 inline-block px-4 py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors shadow-sm">
                                    Browse Files
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </>
                        )}
                    </div>

                    {/* Step 2: Usage Selection */}
                    {file && (
                        <div className="space-y-3 animate-fade-in-up">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Save Destination</p>

                            {/* Option 1: Vault Only */}
                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${uploadOption === 'vault' ? 'border-cla-gold bg-cla-gold/5 ring-1 ring-cla-gold' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1A1A1A]'}`}>
                                <input
                                    type="radio"
                                    name="uploadOption"
                                    className="mt-1 text-cla-gold focus:ring-cla-gold"
                                    checked={uploadOption === 'vault'}
                                    onChange={() => setUploadOption('vault')}
                                />
                                <div>
                                    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                        <FolderLockIcon className="w-4 h-4 text-gray-500" />
                                        Save to Vault Only
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Securely store for your personal records. Not shared with anyone.</p>
                                </div>
                            </label>

                            {/* Option 2: Attach to Case */}
                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${uploadOption === 'case' ? 'border-cla-gold bg-cla-gold/5 ring-1 ring-cla-gold' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1A1A1A]'}`}>
                                <input
                                    type="radio"
                                    name="uploadOption"
                                    className="mt-1 text-cla-gold focus:ring-cla-gold"
                                    checked={uploadOption === 'case'}
                                    onChange={() => setUploadOption('case')}
                                />
                                <div className="w-full">
                                    <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                        <BriefcaseIcon className="w-4 h-4 text-cla-gold" />
                                        Attach to Case & Share
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Link to a case and share with your assigned lawyer.</p>

                                    {uploadOption === 'case' && (
                                        <div className="mt-3 space-y-3 animate-fade-in">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Select Case</label>
                                                <select
                                                    value={selectedCaseId}
                                                    onChange={(e) => setSelectedCaseId(e.target.value)}
                                                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#222] text-gray-900 dark:text-white focus:ring-2 focus:ring-cla-gold focus:border-transparent outline-none"
                                                >
                                                    <option value="">-- Select a case --</option>
                                                    {cases.map(c => (
                                                        <option key={c.id} value={c.id}>{c.title}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {selectedCaseId && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                                                        Will be shared with: <span className="font-bold">{assignedLawyer?.name || 'Assigned Lawyer'}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#151515] border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || (uploadOption === 'case' && !selectedCaseId)}
                        className="px-6 py-2 text-sm font-bold text-cla-text-darker bg-cla-gold rounded-lg shadow-lg shadow-cla-gold/20 hover:bg-yellow-500 hover:shadow-cla-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                    >
                        Upload & {uploadOption === 'case' ? 'Share' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};
