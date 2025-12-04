import apiClient from '../config/apiClient';

export interface DashboardStats {
    active_cases: number;
    hearings_this_week: number;
    pending_tasks: number;
    billable_hours: number;
}

export interface CaseOverviewData {
    [status: string]: number;
}

export interface UpcomingHearing {
    id: string;
    title: string;
    case_number: string;
    date: string;
    court: string;
}

export interface DashboardData {
    stats: DashboardStats;
    case_overview: CaseOverviewData;
    upcoming_hearings: UpcomingHearing[];
    recent_activity: any[]; // Using any for now, matches ActivityLog type
    cases_needing_attention: any[]; // Using any for now, matches Case type
}

const getLawyerDashboardStats = async (): Promise<DashboardData | null> => {
    try {
        const response = await apiClient.get<DashboardData>('/dashboard/lawyer/');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
    }
};

export const dashboardService = {
    getLawyerDashboardStats
};
