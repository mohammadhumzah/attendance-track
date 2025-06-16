
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, User, BookOpen, Hash } from 'lucide-react';

interface AttendanceFormProps {
  onSubmit: (data: {
    name: string;
    subject: string;
    attended: number;
    total: number;
  }) => void;
  defaultSubject?: string;
  hideSubjectField?: boolean;
}

const AttendanceForm = ({ onSubmit, defaultSubject = '', hideSubjectField = false }: AttendanceFormProps) => {
  const [name, setName] = useState('Student');
  const [subject, setSubject] = useState(defaultSubject);
  const [attended, setAttended] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hideSubjectField && !name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!hideSubjectField && !subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    
    if (total <= 0) {
      alert('Total classes must be greater than 0');
      return;
    }
    
    if (attended < 0 || attended > total) {
      alert('Attended classes must be between 0 and total classes');
      return;
    }

    onSubmit({
      name: hideSubjectField ? 'Student' : name.trim(),
      subject: hideSubjectField ? defaultSubject : subject.trim(),
      attended,
      total,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-4 border-emerald-600 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] pixel-card">
      <CardHeader className="pb-4 border-b-4 border-emerald-600">
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-emerald-400 border-2 border-emerald-300 pixel-icon">
            <Calculator className="w-4 h-4 text-slate-900" />
          </div>
          <span className="font-mono text-lg uppercase tracking-wider text-emerald-400">
            CALCULATE ATTENDANCE
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!hideSubjectField && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-emerald-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Student Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 border-2 border-emerald-600 text-emerald-100 placeholder-emerald-400 focus:border-emerald-400 font-mono pixel-input"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {!hideSubjectField && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-emerald-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-800 border-2 border-emerald-600 text-emerald-100 placeholder-emerald-400 focus:border-emerald-400 font-mono pixel-input"
                placeholder="Enter subject name"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attended" className="text-emerald-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-3 h-3" />
                Attended
              </Label>
              <Input
                id="attended"
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
                className="bg-slate-800 border-2 border-emerald-600 text-emerald-100 placeholder-emerald-400 focus:border-emerald-400 font-mono pixel-input text-center"
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total" className="text-emerald-300 font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-3 h-3" />
                Total
              </Label>
              <Input
                id="total"
                type="number"
                min="1"
                value={total}
                onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
                className="bg-slate-800 border-2 border-emerald-600 text-emerald-100 placeholder-emerald-400 focus:border-emerald-400 font-mono pixel-input text-center"
                placeholder="0"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold border-2 border-emerald-300 hover:border-emerald-400 font-mono uppercase tracking-wider pixel-button"
          >
            Calculate Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
