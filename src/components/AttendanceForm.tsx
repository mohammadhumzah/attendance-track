
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AttendanceFormProps {
  onSubmit: (data: {
    name: string;
    attended: number;
    total: number;
  }) => void;
}

const AttendanceForm = ({ onSubmit }: AttendanceFormProps) => {
  const [name, setName] = useState('');
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const attendedNum = parseInt(attended);
    const totalNum = parseInt(total);
    
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
        attended: parseInt(attended),
        total: parseInt(total),
      });
      
      // Reset form
      setName('');
      setAttended('');
      setTotal('');
      setErrors({});
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Plus className="w-5 h-5" />
          Add Attendance Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attended">Classes Attended *</Label>
            <Input
              id="attended"
              type="number"
              min="0"
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
              placeholder="e.g., 18"
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.attended ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.attended && (
              <p className="text-sm text-red-500">{errors.attended}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total">Total Classes Held *</Label>
            <Input
              id="total"
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="e.g., 24"
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.total ? 'border-red-500' : ''
              }`}
              required
            />
            {errors.total && (
              <p className="text-sm text-red-500">{errors.total}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Calculate Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
