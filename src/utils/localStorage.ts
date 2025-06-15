
import { AttendanceRecord } from '@/components/AttendanceHistory';

const STORAGE_KEY = 'attendance_records';

export const saveAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
  const records = getAttendanceRecords();
  const newRecord: AttendanceRecord = {
    ...record,
    id: Date.now().toString(),
  };
  
  records.unshift(newRecord); // Add to beginning of array
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return newRecord;
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const records = JSON.parse(stored);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('Error loading attendance records:', error);
    return [];
  }
};

export const deleteAttendanceRecord = (id: string): void => {
  const records = getAttendanceRecords();
  const filteredRecords = records.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
};

export const updateAttendanceRecord = (updatedRecord: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  const index = records.findIndex(record => record.id === updatedRecord.id);
  
  if (index !== -1) {
    records[index] = updatedRecord;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};
