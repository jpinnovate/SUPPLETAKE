export enum ItemType {
  SUPPLEMENT = 'SUPPLEMENT',
  ROUTINE = 'ROUTINE',
}

export interface TrackerItem {
  id: string;
  name: string;
  type: ItemType;
  details?: string; // e.g., "500mg" or "30 mins"
  timeOfDay?: string; // e.g., "Morning", "Evening"
  icon?: string; // visual helper
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedItemIds: string[];
  notes?: string;
}

export interface AppState {
  items: TrackerItem[];
  logs: Record<string, DailyLog>; // Keyed by date string
}

export type ViewState = 'DASHBOARD' | 'MANAGE' | 'INSIGHTS';
