
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            📚 Attendance Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep track of your class attendance and stay above the 75% requirement. 
            Calculate your current percentage and get smart recommendations.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <div>
              <AttendanceForm onSubmit={handleFormSubmit} />
            </div>
            
            {/* Result Section */}
            <div>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                💡 Pro Tip
              </h3>
              <p className="text-blue-700">
                Most institutions require 75% attendance. This tool helps you stay on track 
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
