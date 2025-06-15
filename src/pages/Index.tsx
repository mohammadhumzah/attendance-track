import React, { useState, useEffect } from 'react';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceResult from '@/components/AttendanceResult';
import AttendanceHistory, { AttendanceRecord } from '@/components/AttendanceHistory';
import Header from '@/components/Header';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import { 
  saveAttendanceEntry, 
  getAttendanceHistory, 
  updateAttendanceEntry,
  deleteAttendanceEntry 
} from '@/utils/supabaseUtils';
import { useToast } from '@/hooks/use-toast';
import { Linkedin } from 'lucide-react';

const Index = () => {
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

  useEffect(() => {
    loadAttendanceHistory();
  }, []);

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
      // Convert Supabase data to AttendanceRecord format
      const formattedRecords: AttendanceRecord[] = data.map(entry => ({
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
    
    const result = {
      ...data,
      percentage: calculation.percentage,
      recommendation: calculation.recommendation,
    };
    
    setCurrentResult(result);
    
    // Save to Supabase
    const { data: savedRecord, error } = await saveAttendanceEntry({
      name: data.name,
      subject: data.subject,
      attended: data.attended,
      total: data.total,
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
      // Reload the history to get the latest data
      loadAttendanceHistory();
      
      toast({
        title: "Attendance Calculated!",
        description: `${data.subject}: ${calculation.percentage.toFixed(1)}% attendance`,
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
      // Update the local state
      setRecords(prev => 
        prev.map(r => r.id === record.id ? record : r)
      );
      
      toast({
        title: "Record Updated",
        description: `${record.subject}: Updated to ${record.percentage.toFixed(1)}%`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4 font-mono">
          TRACK YOUR PROGRESS
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-mono mb-8">
          Keep track of your class attendance with style. Calculate your percentage, 
          get smart recommendations, and stay above the 75% requirement effortlessly.
        </p>
        
        {/* Quick Access to 7th Semester Subjects */}
        <div className="bg-slate-800 border-4 border-emerald-600 p-6 max-w-4xl mx-auto pixel-recommendation-box mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center pixel-icon">
              <span className="text-slate-900 text-lg font-bold">7</span>
            </div>
            <h2 className="text-xl font-bold text-emerald-400 font-mono uppercase tracking-wider">
              7th Semester Quick Access
            </h2>
          </div>
          <p className="text-emerald-300 font-mono text-sm mb-4 uppercase tracking-wider">
            Click on any subject to track attendance with dedicated sidebar navigation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { code: 'pre-project', name: 'Pre-project work' },
              { code: 'ces-414', name: 'CES-414 Seminar' },
              { code: 'cet-415', name: 'CET-415 Process Dynamics' },
              { code: 'cet-416', name: 'CET-416 Process Economics' },
              { code: 'cet-417', name: 'CET-417 Biochemical Engineering' },
              { code: 'cel-418', name: 'CEL-418 Process Dynamics Lab' },
              { code: 'cel-419', name: 'CEL-419 Mass Transfer Lab' },
              { code: 'cet-020-24', name: 'CET-020-24 Elective – I' },
              { code: 'cet-025-29', name: 'CET-025-29 Elective – II' }
            ].map((subject) => (
              <a
                key={subject.code}
                href={`/subject/${subject.code}`}
                className="block p-3 bg-slate-700 border-2 border-slate-600 hover:border-emerald-400 hover:bg-slate-600 transition-colors pixel-button"
              >
                <span className="text-emerald-300 font-mono text-xs uppercase tracking-wider block truncate">
                  {subject.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
          {/* Form Section */}
          <div className="space-y-6">
            <AttendanceForm onSubmit={handleFormSubmit} />
          </div>
          
          {/* Result Section */}
          <div className="space-y-6">
            {currentResult && (
              <AttendanceResult
                name={currentResult.name}
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
        
        {/* Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800 border-4 border-emerald-600 p-8 max-w-2xl mx-auto pixel-recommendation-box">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-400 border-2 border-emerald-300 mb-4 pixel-icon">
              <span className="text-slate-900 text-xl">💡</span>
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mb-3 font-mono uppercase">
              PRO TIP
            </h3>
            <p className="text-emerald-300 leading-relaxed font-mono text-sm">
              Most institutions require 75% attendance. Use quick update buttons (+/-) 
              to track new classes or edit records manually for precise control.
            </p>
          </div>
        </div>

        {/* Credit and Contact Section */}
        <div className="mt-12 pt-8 border-t-4 border-slate-700">
          <div className="text-center space-y-4">
            <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">
              Built by Mohammad Humzah
            </p>
            <a
              href="https://www.linkedin.com/in/mohammadhumzah"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-mono uppercase tracking-wider border-2 border-slate-600 hover:border-emerald-600 px-4 py-2 pixel-button"
            >
              <Linkedin className="w-4 h-4" />
              Contact me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
