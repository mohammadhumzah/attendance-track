
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserCheck } from 'lucide-react';

interface AttendanceFormProps {
  onSubmit: (data: {
    name: string;
    subject: string;
    attended: number;
    total: number;
  }) => void;
}

const AttendanceForm = ({ onSubmit }: AttendanceFormProps) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const attendedNum = parseInt(attended);
    const totalNum = parseInt(total);
    
    if (!subject.trim()) {
      newErrors.subject = 'Please enter a subject name';
    }
    
    if (!attended || attendedNum < 0) {
      newErrors.attended = 'Please enter a valid number of attended classes';
    }
    
    if (!total || totalNum <= 0) {
      newErrors.total = 'Please enter a valid total number of classes';
    }
    
    if (attendedNum > totalNum) {
      newErrors.attended = 'Attended classes cannot exceed total classes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim() || 'Anonymous',
        subject: subject.trim(),
        attended: parseInt(attended),
        total: parseInt(total),
      });
      
      // Reset form
      setName('');
      setSubject('');
      setAttended('');
      setTotal('');
      setErrors({});
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-4 border-emerald-400 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] pixel-card">
      <CardHeader className="pb-4 border-b-4 border-emerald-400">
        <CardTitle className="flex items-center gap-3 text-emerald-400 font-mono text-lg">
          <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center border-2 border-emerald-300 pixel-icon">
            <span className="text-slate-900 text-xl">+</span>
          </div>
          ADD NEW RECORD
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-emerald-300 font-mono text-sm uppercase tracking-wider">Name (Optional)</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-emerald-400 border border-emerald-300 pixel-icon-small"></div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="pl-12 h-12 bg-slate-800 border-2 border-emerald-600 text-emerald-100 font-mono placeholder:text-emerald-600 focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-200 pixel-input"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="subject" className="text-emerald-300 font-mono text-sm uppercase tracking-wider">Subject *</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-emerald-400 border border-emerald-300 pixel-icon-small"></div>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics, Physics"
                className={`pl-12 h-12 bg-slate-800 border-2 text-emerald-100 font-mono placeholder:text-emerald-600 focus:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-200 pixel-input ${
                  errors.subject ? 'border-red-500 focus:border-red-400' : 'border-emerald-600 focus:border-emerald-400'
                }`}
                required
              />
            </div>
            {errors.subject && (
              <p className="text-xs text-red-400 font-mono uppercase">{errors.subject}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="attended" className="text-emerald-300 font-mono text-sm uppercase tracking-wider">Attended *</Label>
              <Input
                id="attended"
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                placeholder="18"
                className={`h-12 bg-slate-800 border-2 text-emerald-100 font-mono placeholder:text-emerald-600 focus:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-200 pixel-input ${
                  errors.attended ? 'border-red-500 focus:border-red-400' : 'border-emerald-600 focus:border-emerald-400'
                }`}
                required
              />
              {errors.attended && (
                <p className="text-xs text-red-400 font-mono uppercase">{errors.attended}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="total" className="text-emerald-300 font-mono text-sm uppercase tracking-wider">Total *</Label>
              <Input
                id="total"
                type="number"
                min="1"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="24"
                className={`h-12 bg-slate-800 border-2 text-emerald-100 font-mono placeholder:text-emerald-600 focus:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-200 pixel-input ${
                  errors.total ? 'border-red-500 focus:border-red-400' : 'border-emerald-600 focus:border-emerald-400'
                }`}
                required
              />
              {errors.total && (
                <p className="text-xs text-red-400 font-mono uppercase">{errors.total}</p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-900 font-mono font-bold text-lg uppercase tracking-wider border-4 border-emerald-300 hover:border-emerald-200 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,0.8)] active:shadow-[2px_2px_0px_0px_rgba(16,185,129,0.8)] transform hover:-translate-y-1 active:translate-y-1 transition-all duration-150 pixel-button"
          >
            CALCULATE ATTENDANCE
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
