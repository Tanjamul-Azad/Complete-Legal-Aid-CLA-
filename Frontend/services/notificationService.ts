import apiClient from '../config/apiClient';
import type { Notification, NotificationSeverity, NotificationType } from '../types';

const TYPE_MAP: Record<string, NotificationType> = {
  CASE_UPDATE: 'case_update',
  BOOKING: 'appointment',
  SYSTEM: 'system',
  REMINDER: 'deadline',
  MESSAGE: 'new_message',
};

const normalizeNotification = (payload: any): Notification => {
  const metadata = typeof payload.metadata_json === 'string'
    ? safeParseJSON(payload.metadata_json)
    : payload.metadata_json || {};

  const link = metadata.link ?? { page: 'overview' };
  const severity: NotificationSeverity = metadata.severity || 'normal';

  return {
    id: payload.notification_id || payload.id,
    userId: payload.user,
    type: TYPE_MAP[payload.type] || 'system',
    title: payload.title,
    body: payload.body,
    link,
    timestamp: new Date(payload.created_at || Date.now()).getTime(),
    read: payload.is_read,
    severity,
  };
};

function safeParseJSON(raw: string) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get('/notifications/');
    const payload = Array.isArray(response.data) ? response.data : response.data.results || [];
    return payload.map(normalizeNotification);
  } catch (error) {
    console.error('Get notifications error:', error);
    return [];
  }
};

const markAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/`, { is_read: true });
    return true;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return false;
  }
};

const markAllAsRead = async (): Promise<boolean> => {
  try {
    await apiClient.post('/notifications/mark_all_read/');
    return true;
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return false;
  }
};

export const notificationService = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
