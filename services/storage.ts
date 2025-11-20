import { AppState, ItemType, TrackerItem, DailyLog } from '../types';

const STORAGE_KEY = 'vitalflow_data_v1';

const DEFAULT_ITEMS: TrackerItem[] = [
  { id: '1', name: 'Vitamin D3', type: ItemType.SUPPLEMENT, details: '5000 IU', timeOfDay: 'Morning' },
  { id: '2', name: 'Magnesium', type: ItemType.SUPPLEMENT, details: '400mg', timeOfDay: 'Evening' },
  { id: '3', name: 'Morning Jog', type: ItemType.ROUTINE, details: '20 mins', timeOfDay: 'Morning' },
  { id: '4', name: 'Read Book', type: ItemType.ROUTINE, details: '10 pages', timeOfDay: 'Evening' },
  { id: '5', name: 'Omega-3', type: ItemType.SUPPLEMENT, details: '1000mg', timeOfDay: 'Lunch' },
];

const INITIAL_STATE: AppState = {
  items: DEFAULT_ITEMS,
  logs: {},
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return INITIAL_STATE;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state", err);
    return INITIAL_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Failed to save state", err);
  }
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const toggleItemCompletion = (
  state: AppState,
  itemId: string,
  date: string
): AppState => {
  const currentLog = state.logs[date] || { date, completedItemIds: [] };
  const isCompleted = currentLog.completedItemIds.includes(itemId);
  
  let newCompletedIds = [...currentLog.completedItemIds];
  if (isCompleted) {
    newCompletedIds = newCompletedIds.filter(id => id !== itemId);
  } else {
    newCompletedIds.push(itemId);
  }

  return {
    ...state,
    logs: {
      ...state.logs,
      [date]: {
        ...currentLog,
        completedItemIds: newCompletedIds,
      },
    },
  };
};
