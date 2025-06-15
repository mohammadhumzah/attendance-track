
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Trash2, Clock } from 'lucide-react';

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
      <Card className="w-full max-w-5xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-violet-700">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <History className="w-5 h-5 text-white" />
            </div>
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Records Yet</h3>
            <p>Add your first attendance record above to get started!</p>
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
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-violet-700">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <History className="w-5 h-5 text-white" />
          </div>
          Attendance History
          <Badge variant="secondary" className="ml-auto bg-violet-100 text-violet-700">
            {records.length} records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-violet-100">
                  <th className="text-left py-4 px-3 font-bold text-violet-700">Name</th>
                  <th className="text-center py-4 px-3 font-bold text-violet-700">Attended</th>
                  <th className="text-center py-4 px-3 font-bold text-violet-700">Total</th>
                  <th className="text-center py-4 px-3 font-bold text-violet-700">Percentage</th>
                  <th className="text-center py-4 px-3 font-bold text-violet-700">Date</th>
                  <th className="text-center py-4 px-3 font-bold text-violet-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id} className={`border-b border-gray-100 hover:bg-violet-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                  }`}>
                    <td className="py-4 px-3 font-semibold text-gray-800">{record.name}</td>
                    <td className="py-4 px-3 text-center font-medium">{record.attended}</td>
                    <td className="py-4 px-3 text-center font-medium">{record.total}</td>
                    <td className="py-4 px-3 text-center">
                      <Badge 
                        variant={record.percentage >= 75 ? "default" : "destructive"}
                        className={`${
                          record.percentage >= 75 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        }`}
                      >
                        {record.percentage.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="py-4 px-3 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
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
              <div key={record.id} className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-5 border-2 border-violet-100">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-800 text-lg">{record.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteRecord(record.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-gray-600 block">Attended:</span>
                    <span className="font-bold text-lg">{record.attended}</span>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-gray-600 block">Total:</span>
                    <span className="font-bold text-lg">{record.total}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge 
                    variant={record.percentage >= 75 ? "default" : "destructive"}
                    className={`text-sm px-3 py-1 ${
                      record.percentage >= 75 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    }`}
                  >
                    {record.percentage.toFixed(1)}%
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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
