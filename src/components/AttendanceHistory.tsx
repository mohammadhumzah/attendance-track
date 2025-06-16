
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Trash2, Clock, Edit3, Check, X, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface AttendanceRecord {
  id: string;
  name: string;
  subject: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ attended: number; total: number }>({ attended: 0, total: 0 });

  if (records.length === 0) {
    return (
      <Card className="w-full max-w-7xl mx-auto border-4 border-emerald-400 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] pixel-card">
        <CardHeader className="pb-4 border-b-4 border-emerald-400">
          <CardTitle className="flex items-center gap-3 text-emerald-400 font-mono text-lg">
            <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center border-2 border-emerald-300 pixel-icon">
              <span className="text-slate-900 text-xl">📊</span>
            </div>
            ATTENDANCE HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-emerald-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 border-2 border-emerald-600 mb-4 pixel-icon">
              <History className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-emerald-400 mb-2 font-mono uppercase">NO RECORDS YET</h3>
            <p className="font-mono text-sm">Add your first attendance record above to get started!</p>
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

  const handleEdit = (record: AttendanceRecord) => {
    setEditingId(record.id);
    setEditData({ attended: record.attended, total: record.total });
  };

  const handleSave = (record: AttendanceRecord) => {
    const newPercentage = (editData.attended / editData.total) * 100;
    const updatedRecord = {
      ...record,
      attended: editData.attended,
      total: editData.total,
      percentage: newPercentage,
    };
    onUpdateRecord(updatedRecord);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ attended: 0, total: 0 });
  };

  const handleQuickUpdate = (record: AttendanceRecord, type: 'attend' | 'miss') => {
    const newTotal = record.total + 1;
    const newAttended = type === 'attend' ? record.attended + 1 : record.attended;
    const newPercentage = (newAttended / newTotal) * 100;
    
    const updatedRecord = {
      ...record,
      attended: newAttended,
      total: newTotal,
      percentage: newPercentage,
    };
    onUpdateRecord(updatedRecord);
  };

  // Group records by subject
  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.subject]) {
      acc[record.subject] = [];
    }
    acc[record.subject].push(record);
    return acc;
  }, {} as { [key: string]: AttendanceRecord[] });

  return (
    <Card className="w-full max-w-7xl mx-auto border-4 border-emerald-400 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] pixel-card">
      <CardHeader className="pb-4 border-b-4 border-emerald-400">
        <CardTitle className="flex items-center gap-3 text-emerald-400 font-mono text-lg">
          <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center border-2 border-emerald-300 pixel-icon">
            <span className="text-slate-900 text-xl">📊</span>
          </div>
          ATTENDANCE HISTORY
          <Badge className="ml-auto bg-emerald-400 text-slate-900 font-mono border-2 border-emerald-300 pixel-badge">
            {records.length} RECORDS
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([subject, subjectRecords]) => (
            <div key={subject} className="space-y-4">
              <h3 className="text-xl font-bold text-emerald-400 font-mono uppercase tracking-wider border-b-2 border-emerald-600 pb-2">
                {subject}
              </h3>
              
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="bg-slate-800 border-4 border-emerald-600 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-4 border-emerald-600 bg-slate-700 hover:bg-slate-700">
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase px-6 py-4">NAME</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">ATTENDED</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">TOTAL</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">PERCENTAGE</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">RECOMMENDATION</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">QUICK UPDATE</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">DATE</TableHead>
                        <TableHead className="font-bold text-emerald-400 font-mono text-sm uppercase text-center px-4 py-4">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectRecords.map((record) => {
                        const calculation = calculateAttendance(record.attended, record.total);
                        
                        return (
                          <TableRow key={record.id} className="border-b-2 border-emerald-700/30 hover:bg-slate-700/50 transition-colors">
                            <TableCell className="font-bold text-emerald-100 font-mono px-6 py-4">
                              {record.name}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              {editingId === record.id ? (
                                <Input
                                  type="number"
                                  value={editData.attended}
                                  onChange={(e) => setEditData(prev => ({ ...prev, attended: parseInt(e.target.value) || 0 }))}
                                  className="w-16 h-8 text-center bg-slate-700 border-2 border-emerald-600 text-emerald-100 font-mono"
                                />
                              ) : (
                                <span className="font-mono text-emerald-100 text-lg">{record.attended}</span>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              {editingId === record.id ? (
                                <Input
                                  type="number"
                                  value={editData.total}
                                  onChange={(e) => setEditData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                                  className="w-16 h-8 text-center bg-slate-700 border-2 border-emerald-600 text-emerald-100 font-mono"
                                />
                              ) : (
                                <span className="font-mono text-emerald-100 text-lg">{record.total}</span>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <Badge 
                                className={`font-mono text-sm font-bold border-2 ${
                                  record.percentage >= 75 
                                    ? 'bg-emerald-400 text-slate-900 border-emerald-300' 
                                    : 'bg-orange-400 text-slate-900 border-orange-300'
                                }`}
                              >
                                {record.percentage.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-mono font-bold uppercase ${
                                calculation.recommendation.type === 'can_miss'
                                  ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                                  : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
                              }`}>
                                {calculation.recommendation.type === 'can_miss' ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <div className="text-center">
                                  <div className="leading-tight">
                                    {calculation.recommendation.type === 'can_miss' ? 'CAN MISS' : 'MUST ATTEND'}
                                  </div>
                                  <div className="text-xs opacity-80 mt-1">
                                    {calculation.recommendation.classes} {calculation.recommendation.classes === 1 ? 'CLASS' : 'CLASSES'}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              {editingId !== record.id && (
                                <div className="flex justify-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickUpdate(record, 'attend')}
                                    className="h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-emerald-300 font-bold text-lg"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickUpdate(record, 'miss')}
                                    className="h-10 w-10 p-0 bg-orange-500 hover:bg-orange-400 text-slate-900 border-2 border-orange-300 font-bold text-lg"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <div className="text-xs text-emerald-300 font-mono flex items-center justify-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(record.date)}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <div className="flex justify-center gap-2">
                                {editingId === record.id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSave(record)}
                                      className="h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-emerald-300"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={handleCancel}
                                      className="h-10 w-10 p-0 bg-orange-500 hover:bg-orange-400 text-slate-900 border-2 border-orange-300"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleEdit(record)}
                                      className="h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-emerald-300"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => onDeleteRecord(record.id)}
                                      className="h-10 w-10 p-0 bg-red-500 hover:bg-red-400 text-white border-2 border-red-300"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {subjectRecords.map((record) => {
                  const calculation = calculateAttendance(record.attended, record.total);
                  
                  return (
                    <div key={record.id} className="bg-slate-800 border-4 border-emerald-600 p-5 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-emerald-100 text-lg font-mono uppercase">{record.name}</h4>
                        <Badge 
                          className={`font-mono text-sm border-2 ${
                            record.percentage >= 75 
                              ? 'bg-emerald-400 text-slate-900 border-emerald-300' 
                              : 'bg-orange-400 text-slate-900 border-orange-300'
                          }`}
                        >
                          {record.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-700 border-2 border-emerald-600 p-3 rounded">
                          <span className="text-emerald-300 block text-xs font-mono uppercase">Attended:</span>
                          <span className="font-bold text-lg text-emerald-100 font-mono">{record.attended}</span>
                        </div>
                        <div className="bg-slate-700 border-2 border-emerald-600 p-3 rounded">
                          <span className="text-emerald-300 block text-xs font-mono uppercase">Total:</span>
                          <span className="font-bold text-lg text-emerald-100 font-mono">{record.total}</span>
                        </div>
                      </div>
                      
                      {/* Recommendation Section */}
                      <div className={`p-4 rounded-xl border-2 mb-4 ${
                        calculation.recommendation.type === 'can_miss'
                          ? 'bg-emerald-900/20 border-emerald-400/50'
                          : 'bg-orange-900/20 border-orange-400/50'
                      } backdrop-blur-sm`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                            calculation.recommendation.type === 'can_miss'
                              ? 'bg-emerald-400 border-emerald-300'
                              : 'bg-orange-400 border-orange-300'
                          }`}>
                            {calculation.recommendation.type === 'can_miss' ? (
                              <TrendingUp className="w-4 h-4 text-slate-900" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-slate-900" />
                            )}
                          </div>
                          <div>
                            <p className={`font-bold text-sm mb-2 font-mono uppercase tracking-wider ${
                              calculation.recommendation.type === 'can_miss' ? 'text-emerald-400' : 'text-orange-400'
                            }`}>
                              {calculation.recommendation.type === 'can_miss' ? 'CAN MISS' : 'MUST ATTEND'}
                            </p>
                            <p className={`text-xs leading-relaxed font-mono ${
                              calculation.recommendation.type === 'can_miss' ? 'text-emerald-300' : 'text-orange-300'
                            }`}>
                              {calculation.recommendation.message}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleQuickUpdate(record, 'attend')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-emerald-300 font-mono text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            ATTEND
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleQuickUpdate(record, 'miss')}
                            className="bg-orange-500 hover:bg-orange-400 text-slate-900 border-2 border-orange-300 font-mono text-xs"
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            MISS
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 border-2 border-emerald-300"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onDeleteRecord(record.id)}
                            className="bg-red-500 hover:bg-red-400 text-white border-2 border-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-emerald-300 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(record.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
