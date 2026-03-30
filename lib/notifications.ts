export type NotificationType = 'meeting' | 'system' | 'activity' | 'birthday';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  link?: string;
  meetingId?: string; // To avoid duplicates
  birthdayId?: string; // To avoid duplicates
  activityId?: string; // To avoid duplicates
  eventDate?: string; // The actual date of the event
}

export interface Meeting {
  id: string;
  tema: string;
  data: string; // ISO date string or YYYY-MM-DD
}

export interface Birthday {
  id: string;
  name: string;
  date: string; // MM-DD
}

export interface Activity {
  id: string;
  title: string;
  dueDate: string; // ISO date string or YYYY-MM-DD
}

export interface NotificationSettings {
  enabled: boolean;
  leadTimeHours: number; // e.g., 24
  notifyByEmail: boolean;
  notifyByPush: boolean;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  leadTimeHours: 24,
  notifyByEmail: true,
  notifyByPush: true,
};
