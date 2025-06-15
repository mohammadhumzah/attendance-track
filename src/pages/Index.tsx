
import React, { useState, useEffect } from 'react';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceResult from '@/components/AttendanceResult';
import AttendanceHistory, { AttendanceRecord } from '@/components/AttendanceHistory';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import { 
  saveAttendanceRecord, 
  getAttendanceRecords, 
  deleteAttendanceRecord 
} from '@/utils/localStorage';
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
  const { toast } = useToast();

  useEffect(() => {
    setRecords(getAttendanceRecords());
  }, []);

  const handleFormSubmit = (data: {
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
    
    // Save to localStorage
    const savedRecord = saveAttendanceRecord({
      name: data.name,
      attended: data.attended,
      total: data.total,
      percentage: calculation.percentage,
      date: new Date().toISOString(),
    });
    
    setRecords(prev => [savedRecord, ...prev]);
    
    toast({
      title: "Attendance Calculated!",
      description: `Your attendance is ${calculation.percentage.toFixed(1)}%`,
    });
  };

  const handleDeleteRecord = (id: string) => {
    deleteAttendanceRecord(id);
    setRecords(prev => prev.filter(record => record.id !== id));
    
    toast({
      title: "Record Deleted",
      description: "Attendance record has been removed.",
    });
  };

  const handleUpdateRecord = (record: AttendanceRecord) => {
    // This could be expanded for editing functionality
    console.log('Update record:', record);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl mb-6">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            StudyTrack
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
          <AttendanceHistory
            records={records}
            onDeleteRecord={handleDeleteRecord}
            onUpdateRecord={handleUpdateRecord}
          />
          
          {/* Info Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl mb-4">
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-violet-800 mb-3">
                Pro Tip
              </h3>
              <p className="text-violet-700 leading-relaxed">
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
