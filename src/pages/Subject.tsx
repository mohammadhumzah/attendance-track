

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceResult from '@/components/AttendanceResult';
import AttendanceHistory, { AttendanceRecord } from '@/components/AttendanceHistory';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import { 
  saveAttendanceEntry, 
  getAttendanceHistory, 
  updateAttendanceEntry,
  deleteAttendanceEntry 
} from '@/utils/supabaseUtils';
import { useToast } from '@/hooks/use-toast';
import { Book } from 'lucide-react';

const subjectNames: Record<string, string> = {
  // 5th Semester
  'cet-305': 'Process Equipment Design– I',
  'cet-306': 'Chemical Reaction Engineering',
  'cet-307': 'Mass Transfer-I',
  'cet-308': 'Chemical Technology – I',
  'hst-309': 'Basic Management Principles',
  'mat-310': 'Numerical Methods',
  'cel-311': 'Heat Transfer Lab',
  'cel-312': 'Computer Simulation Lab',
  
  // 6th Semester
  'cet-355': 'Process Equipment Design -II',
  'cet-356': 'Mass Transfer – II',
  'cet-357': 'Chemical Technology – II',
  'cet-358': 'Energy Technology',
  'cet-359': 'Chemical Process Safety',
  'cet-360': 'Transport Phenomena',
  'cel-361': 'Energy Technology Lab',
  'cel-362': 'Thermodynamics & Reaction Engineering Lab',
  'cei-363': 'Industrial Training & Presentation',
  
  // 7th Semester
  'pre-project': 'Pre-project work',
  'ces-414': 'CES-414 Seminar',
  'cet-415': 'CET-415 Process Dynamics',
  'cet-416': 'CET-416 Process Economics',
  'cet-417': 'CET-417 Biochemical Engineering',
  'cel-418': 'CEL-418 Process Dynamics Lab',
  'cel-419': 'CEL-419 Mass Transfer Lab',
  'cet-020-24': 'CET-020-24 Elective – I',
  'cet-025-29': 'CET-025-29 Elective – II',
  
  // 8th Semester
  'cet-465': 'Project Work',
  'cel-466': 'Biochemical Engineering Lab',
  'cet-467': 'Modeling & Simulation of Chemical Process Systems',
  'cet-468': 'Industrial Pollution Abatement',
  'cet-069-72': 'Elective – III',
  'cet-073-76': 'Elective – IV'
};

const Subject = () => {
  const { subjectCode } = useParams<{ subjectCode: string }>();
  const [currentResult, setCurrentResult] = useState<{
    name: string;
    subject: string;
    attended: number;
    total: number;
    percentage: number;
    recommendation: {
      type: 'can_miss' | 'need_attend';
      classes: number;
      message: string;
    };
  } | null>(null);
  
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const subjectName = subjectCode ? subjectNames[subjectCode] : 'Unknown Subject';

  useEffect(() => {
    if (subjectCode) {
      loadAttendanceHistory();
    }
  }, [subjectCode]);

  const loadAttendanceHistory = async () => {
    setLoading(true);
    const { data, error } = await getAttendanceHistory();
    
    if (error) {
      console.error('Error loading attendance history:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance history.",
        variant: "destructive",
      });
    } else {
      // Filter records for the current subject
      const formattedRecords: AttendanceRecord[] = data
        .filter(entry => entry.subject === subjectName)
        .map(entry => ({
          id: entry.id,
          name: entry.entry_data.name,
          subject: entry.entry_data.subject || entry.subject,
          attended: entry.entry_data.attended,
          total: entry.entry_data.total,
          percentage: entry.entry_data.percentage,
          date: entry.created_at,
        }));
      setRecords(formattedRecords);
    }
    setLoading(false);
  };

  const handleFormSubmit = async (data: {
    name: string;
    subject: string;
    attended: number;
    total: number;
  }) => {
    const calculation = calculateAttendance(data.attended, data.total);
    
    // Use the subject name from the route instead of form input
    const subjectData = {
      ...data,
      subject: subjectName
    };
    
    const result = {
      ...subjectData,
      percentage: calculation.percentage,
      recommendation: calculation.recommendation,
    };
    
    setCurrentResult(result);
    
    // Save to Supabase
    const { data: savedRecord, error } = await saveAttendanceEntry({
      name: subjectData.name,
      subject: subjectName,
      attended: subjectData.attended,
      total: subjectData.total,
      percentage: calculation.percentage,
    });
    
    if (error) {
      console.error('Error saving attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance record.",
        variant: "destructive",
      });
    } else {
      loadAttendanceHistory();
      
      toast({
        title: "Attendance Calculated!",
        description: `${subjectName}: ${calculation.percentage.toFixed(1)}% attendance`,
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const { error } = await deleteAttendanceEntry(id);
    
    if (error) {
      console.error('Error deleting attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to delete attendance record.",
        variant: "destructive",
      });
    } else {
      setRecords(prev => prev.filter(record => record.id !== id));
      
      toast({
        title: "Record Deleted",
        description: "Attendance record has been removed.",
      });
    }
  };

  const handleUpdateRecord = async (record: AttendanceRecord) => {
    const { error } = await updateAttendanceEntry(record.id, {
      name: record.name,
      subject: record.subject,
      attended: record.attended,
      total: record.total,
      percentage: record.percentage,
    });
    
    if (error) {
      console.error('Error updating attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance record.",
        variant: "destructive",
      });
    } else {
      setRecords(prev => 
        prev.map(r => r.id === record.id ? record : r)
      );
      
      toast({
        title: "Record Updated",
        description: `${record.subject}: Updated to ${record.percentage.toFixed(1)}%`,
      });
    }
  };

  if (!subjectCode || !subjectName || subjectName === 'Unknown Subject') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 border-4 border-orange-400 mb-4 pixel-icon">
            <span className="text-orange-400 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-orange-400 mb-2 font-mono uppercase">
            Subject Not Found
          </h1>
          <p className="text-orange-300 font-mono">
            The requested subject could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center pixel-icon">
              <Book className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-mono uppercase tracking-wider">
              {subjectName}
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-mono">
            Track your attendance for this subject. Calculate your percentage, 
            get smart recommendations, and stay above the 75% requirement.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
          {/* Form Section */}
          <div className="space-y-6">
            <AttendanceForm 
              onSubmit={handleFormSubmit} 
              defaultSubject={subjectName}
              hideSubjectField={true}
            />
          </div>
          
          {/* Result Section */}
          <div className="space-y-6">
            {currentResult && (
              <AttendanceResult
                name={currentResult.name}
                subject={currentResult.subject}
                attended={currentResult.attended}
                total={currentResult.total}
                percentage={currentResult.percentage}
                recommendation={currentResult.recommendation}
              />
            )}
          </div>
        </div>
        
        {/* History Section */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 border-4 border-emerald-400 mb-4 pixel-icon">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-emerald-400 font-mono uppercase">Loading attendance history...</p>
          </div>
        ) : (
          <AttendanceHistory
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onUpdateRecord={handleUpdateRecord}
          />
        )}
      </div>
    </div>
  );
};

export default Subject;

