
import React, { useState, useEffect } from 'react';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceResult from '@/components/AttendanceResult';
import AttendanceHistory, { AttendanceRecord } from '@/components/AttendanceHistory';
import Header from '@/components/Header';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import { 
  saveAttendanceEntry, 
  getAttendanceHistory, 
  deleteAttendanceEntry 
} from '@/utils/supabaseUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentResult, setCurrentResult] = useState<{
    name: string;
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
        description: `Your attendance is ${calculation.percentage.toFixed(1)}%`,
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

  const handleUpdateRecord = (record: AttendanceRecord) => {
    // This could be expanded for editing functionality
    console.log('Update record:', record);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Track Your Progress
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Keep track of your class attendance with style. Calculate your percentage, 
            get smart recommendations, and stay above the 75% requirement effortlessly.
          </p>
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-purple-400">Loading attendance history...</p>
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
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-purple-400 mb-3">
                Pro Tip
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Most institutions require 75% attendance. StudyTrack helps you stay on track 
                by showing exactly how many classes you can miss or need to attend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
