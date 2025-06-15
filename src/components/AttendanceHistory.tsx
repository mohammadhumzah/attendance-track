
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';

export interface AttendanceRecord {
  id: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  date: string;
}

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  onDeleteRecord: (id: string) => void;
  onUpdateRecord: (record: AttendanceRecord) => void;
}

const AttendanceHistory = ({ records, onDeleteRecord, onUpdateRecord }: AttendanceHistoryProps) => {
  if (records.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-600">
            <History className="w-5 h-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No attendance records yet. Add your first record above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <History className="w-5 h-5" />
          Attendance History ({records.length} records)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Attended</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Total</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Percentage</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-gray-800">{record.name}</td>
                    <td className="py-3 px-2 text-center">{record.attended}</td>
                    <td className="py-3 px-2 text-center">{record.total}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={record.percentage >= 75 ? "default" : "destructive"}>
                        {record.percentage.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center text-sm text-gray-600">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {records.map((record) => (
              <div key={record.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{record.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteRecord(record.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Attended:</span>
                    <span className="ml-1 font-medium">{record.attended}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-1 font-medium">{record.total}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <Badge variant={record.percentage >= 75 ? "default" : "destructive"}>
                    {record.percentage.toFixed(1)}%
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(record.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
