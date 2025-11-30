import React, { useState } from 'react';
import { CloseIcon } from '../../icons';
import { FormInput } from '../../ui/FormInputs';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (invoiceData: any) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        clientName: '',
        caseTitle: '',
        amount: '',
        dueDate: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        // Reset form
        setFormData({
            clientName: '',
            caseTitle: '',
            amount: '',
            dueDate: '',
            description: ''
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white dark:bg-cla-surface-dark rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-cla-border dark:border-cla-border-dark">
                <div className="flex justify-between items-center p-6 border-b border-cla-border dark:border-cla-border-dark">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <FormInput
                        id="clientName"
                        label="Client Name"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                    />
                    <FormInput
                        id="caseTitle"
                        label="Case Title"
                        value={formData.caseTitle}
                        onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            id="amount"
                            label="Amount (BDT)"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <FormInput
                            id="dueDate"
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-cla-text dark:text-cla-text-dark">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 bg-cla-bg dark:bg-cla-bg-dark border border-cla-border dark:border-cla-border-dark rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cla-gold focus:border-cla-gold sm:text-sm text-cla-text dark:text-cla-text-dark"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-cla-gold text-cla-text font-semibold rounded-lg hover:bg-cla-gold-darker"
                        >
                            Create Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
