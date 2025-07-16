
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
      <Card className="w-full max-w-7xl mx-auto nothing-card nothing-glow">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="flex items-center gap-3 text-foreground font-mono text-lg nothing-text heading">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center border border-border rounded-lg">
              <span className="text-lg">📊</span>
            </div>
            ATTENDANCE HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted border border-border mb-4 rounded-lg">
              <History className="w-8 h-8 text-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-mono uppercase nothing-text heading">NO RECORDS YET</h3>
            <p className="font-mono text-sm nothing-text">Add your first attendance record above to get started!</p>
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
    <Card className="w-full max-w-7xl mx-auto nothing-card nothing-glow">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="flex items-center gap-3 text-foreground font-mono text-lg nothing-text heading">
          <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center border border-border rounded-lg">
            <span className="text-lg">📊</span>
          </div>
          ATTENDANCE HISTORY
          <Badge className="ml-auto nothing-badge">
            {records.length} RECORDS
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([subject, subjectRecords]) => (
            <div key={subject} className="space-y-4">
              <h3 className="text-xl font-bold text-foreground font-mono uppercase tracking-wider border-b-2 border-border pb-2 nothing-text heading">
                {subject}
              </h3>
              
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="bg-card border border-border rounded-lg overflow-hidden nothing-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted hover:bg-muted">
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase px-6 py-4 nothing-text heading">NAME</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">ATTENDED</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">TOTAL</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">PERCENTAGE</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">RECOMMENDATION</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">QUICK UPDATE</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">DATE</TableHead>
                        <TableHead className="font-bold text-foreground font-mono text-sm uppercase text-center px-4 py-4 nothing-text heading">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectRecords.map((record) => {
                        const calculation = calculateAttendance(record.attended, record.total);
                        
                        return (
                          <TableRow key={record.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                            <TableCell className="font-bold text-foreground font-mono px-6 py-4 nothing-text">
                              {record.name}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              {editingId === record.id ? (
                                <Input
                                  type="number"
                                  value={editData.attended}
                                  onChange={(e) => setEditData(prev => ({ ...prev, attended: parseInt(e.target.value) || 0 }))}
                                  className="w-16 h-8 text-center nothing-input"
                                />
                              ) : (
                                <span className="font-mono text-foreground text-lg nothing-text">{record.attended}</span>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              {editingId === record.id ? (
                                <Input
                                  type="number"
                                  value={editData.total}
                                  onChange={(e) => setEditData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                                  className="w-16 h-8 text-center nothing-input"
                                />
                              ) : (
                                <span className="font-mono text-foreground text-lg nothing-text">{record.total}</span>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <Badge 
                                className={`font-mono text-sm font-bold ${
                                  record.percentage >= 75 
                                    ? 'nothing-success' 
                                    : 'nothing-warning'
                                }`}
                              >
                                {record.percentage.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono font-bold uppercase ${
                                calculation.recommendation.type === 'can_miss'
                                  ? 'nothing-success-bg text-foreground'
                                  : 'nothing-warning-bg text-muted-foreground'
                              }`}>
                                {calculation.recommendation.type === 'can_miss' ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <div className="text-center">
                                  <div className="leading-tight nothing-text">
                                    {calculation.recommendation.type === 'can_miss' ? 'CAN MISS' : 'MUST ATTEND'}
                                  </div>
                                  <div className="text-xs opacity-80 mt-1 nothing-text">
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
                                    className="h-10 w-10 p-0 nothing-button nothing-success"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleQuickUpdate(record, 'miss')}
                                    className="h-10 w-10 p-0 nothing-button nothing-warning"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center px-4 py-4">
                              <div className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-2 nothing-text">
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
                                      className="h-10 w-10 p-0 nothing-button nothing-success"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={handleCancel}
                                      className="h-10 w-10 p-0 nothing-button nothing-warning"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleEdit(record)}
                                      className="h-10 w-10 p-0 nothing-button"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => onDeleteRecord(record.id)}
                                      className="h-10 w-10 p-0 nothing-button text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                    <div key={record.id} className="nothing-card p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-foreground text-lg font-mono uppercase nothing-text heading">{record.name}</h4>
                        <Badge 
                          className={`font-mono text-sm ${
                            record.percentage >= 75 
                              ? 'nothing-success' 
                              : 'nothing-warning'
                          }`}
                        >
                          {record.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-muted border border-border p-3 rounded-lg">
                          <span className="text-muted-foreground block text-xs font-mono uppercase nothing-text">Attended:</span>
                          <span className="font-bold text-lg text-foreground font-mono nothing-text">{record.attended}</span>
                        </div>
                        <div className="bg-muted border border-border p-3 rounded-lg">
                          <span className="text-muted-foreground block text-xs font-mono uppercase nothing-text">Total:</span>
                          <span className="font-bold text-lg text-foreground font-mono nothing-text">{record.total}</span>
                        </div>
                      </div>
                      
                      {/* Recommendation Section */}
                      <div className={`p-4 rounded-xl mb-4 ${
                        calculation.recommendation.type === 'can_miss'
                          ? 'nothing-success-bg'
                          : 'nothing-warning-bg'
                      } backdrop-blur-sm`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            calculation.recommendation.type === 'can_miss'
                              ? 'nothing-success'
                              : 'nothing-warning'
                          }`}>
                            {calculation.recommendation.type === 'can_miss' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className={`font-bold text-sm mb-2 font-mono uppercase tracking-wider nothing-text heading ${
                              calculation.recommendation.type === 'can_miss' ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {calculation.recommendation.type === 'can_miss' ? 'CAN MISS' : 'MUST ATTEND'}
                            </p>
                            <p className={`text-xs leading-relaxed font-mono nothing-text ${
                              calculation.recommendation.type === 'can_miss' ? 'text-muted-foreground' : 'text-muted-foreground'
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
                            className="nothing-button nothing-success font-mono text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            ATTEND
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleQuickUpdate(record, 'miss')}
                            className="nothing-button nothing-warning font-mono text-xs"
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            MISS
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="nothing-button"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onDeleteRecord(record.id)}
                            className="nothing-button text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 nothing-text">
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
