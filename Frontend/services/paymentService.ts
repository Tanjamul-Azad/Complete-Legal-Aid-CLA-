export interface Invoice {
    id: string;
    caseTitle: string;
    lawyerName?: string;
    clientName?: string;
    amount: number;
    status: 'paid' | 'unpaid' | 'overdue';
    dueDate: string;
    issuedDate?: string;
    method?: string;
    caseId?: string;
}

export interface CitizenPayment {
    id: string;
    paidAt: string;
    invoiceId: string;
    caseTitle: string;
    amount: number;
    method: string;
}

export interface PayoutMethods {
    bank: {
        bankName: string;
        branch: string;
        accountName: string;
        accountNumber: string;
        routingNumber: string;
        verified: boolean;
    };
    wallet: {
        provider: string;
        walletNumber: string;
        holder: string;
        verified: boolean;
    };
}

export const getInvoices = async (): Promise<Invoice[]> => {
    // Mock data
    return [
        {
            id: 'INV-2024-001',
            caseTitle: 'Land Dispute Resolution',
            lawyerName: 'Advocate Rahim',
            clientName: 'John Doe',
            amount: 15000,
            status: 'unpaid',
            dueDate: '2024-11-30',
            issuedDate: '2024-11-01',
            method: 'Bank Transfer',
            caseId: 'CASE-101'
        },
        {
            id: 'INV-2024-002',
            caseTitle: 'Family Consultation',
            lawyerName: 'Barrister Sarah',
            clientName: 'Rahim Ahmed',
            amount: 5000,
            status: 'overdue',
            dueDate: '2024-11-15',
            issuedDate: '2024-10-15',
            method: 'bKash',
            caseId: 'CASE-102'
        }
    ];
};

export const getCitizenPaymentHistory = async (userId: string): Promise<CitizenPayment[]> => {
    // Mock data
    return [
        {
            id: 'PAY-101',
            paidAt: 'Nov 18, 2024',
            invoiceId: 'INV-2023-099',
            caseTitle: 'Property Registration',
            amount: 5000,
            method: 'bKash'
        },
        {
            id: 'PAY-102',
            paidAt: 'Oct 25, 2024',
            invoiceId: 'INV-2023-085',
            caseTitle: 'Legal Advice',
            amount: 2000,
            method: 'VISA'
        }
    ];
};

export const getPayoutMethods = async (): Promise<PayoutMethods | null> => {
    // Mock data
    return {
        bank: {
            bankName: 'City Bank',
            branch: 'Gulshan',
            accountName: 'Rahim Ahmed',
            accountNumber: '1234567890',
            routingNumber: '098765432',
            verified: true
        },
        wallet: {
            provider: 'bKash',
            walletNumber: '01711223344',
            holder: 'Rahim Ahmed',
            verified: true
        }
    };
};

export const savePayoutMethods = async (methods: PayoutMethods): Promise<void> => {
    console.log('Saving payout methods:', methods);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
};

export interface PaymentSummary {
    outstandingInvoices: number;
    paidThisMonth: number;
    payout: {
        nextPayoutAmount: number;
        nextPayoutDate: string;
        method: string;
    };
}

export interface PaymentHistoryItem {
    id: string;
    date: string;
    client: string;
    service: string;
    amount: number;
    status: 'paid' | 'pending' | 'processing';
}

export const getPaymentSummary = async (): Promise<PaymentSummary> => {
    return {
        outstandingInvoices: 32500,
        paidThisMonth: 74800,
        payout: {
            nextPayoutAmount: 21000,
            nextPayoutDate: '2024-11-25',
            method: 'Bank Transfer'
        }
    };
};

export const getPaymentHistory = async (): Promise<PaymentHistoryItem[]> => {
    return [
        {
            id: 'TXN-1001',
            date: '2024-11-20',
            client: 'Rahim Ahmed',
            service: 'Consultation',
            amount: 5000,
            status: 'paid'
        },
        {
            id: 'TXN-1002',
            date: '2024-11-18',
            client: 'Karim Uddin',
            service: 'Document Review',
            amount: 3500,
            status: 'pending'
        }
    ];
};

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
    const invoices = await getInvoices();
    return invoices.find(inv => inv.id === id) || null;
};
