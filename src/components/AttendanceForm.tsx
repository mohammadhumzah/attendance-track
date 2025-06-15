
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UserCheck } from 'lucide-react';

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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-violet-700">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          Add New Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">Name (Optional)</Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="pl-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg h-12"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="attended" className="text-gray-700 font-medium">Attended *</Label>
              <Input
                id="attended"
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                placeholder="18"
                className={`border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg h-12 ${
                  errors.attended ? 'border-red-500 focus:border-red-500' : ''
                }`}
                required
              />
              {errors.attended && (
                <p className="text-sm text-red-500">{errors.attended}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total" className="text-gray-700 font-medium">Total *</Label>
              <Input
                id="total"
                type="number"
                min="1"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="24"
                className={`border-gray-200 focus:border-violet-500 focus:ring-violet-500 rounded-lg h-12 ${
                  errors.total ? 'border-red-500 focus:border-red-500' : ''
                }`}
                required
              />
              {errors.total && (
                <p className="text-sm text-red-500">{errors.total}</p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg h-12 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Calculate Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
