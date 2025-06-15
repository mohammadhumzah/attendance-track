
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface AttendanceResultProps {
  name: string;
  attended: number;
  total: number;
  percentage: number;
  recommendation: {
    type: 'can_miss' | 'need_attend';
    classes: number;
    message: string;
  };
}

const AttendanceResult = ({ name, attended, total, percentage, recommendation }: AttendanceResultProps) => {
  const isAbove75 = percentage >= 75;
  
  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAbove75 ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          Attendance Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Attended: {attended}</span>
            <span>Total: {total}</span>
          </div>
          
          <div className="relative">
            <div className="text-4xl font-bold mb-2">
              <span className={isAbove75 ? 'text-green-600' : 'text-red-600'}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Badge 
              variant={isAbove75 ? "default" : "destructive"}
              className="mb-4"
            >
              {isAbove75 ? 'Above 75%' : 'Below 75%'}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isAbove75 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isAbove75 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            <Calendar className={`w-5 h-5 mt-0.5 ${
              isAbove75 ? 'text-green-600' : 'text-red-600'
            }`} />
            <div>
              <p className={`font-semibold ${
                isAbove75 ? 'text-green-800' : 'text-red-800'
              }`}>
                {recommendation.type === 'can_miss' ? 'Good News!' : 'Action Required'}
              </p>
              <p className={`text-sm ${
                isAbove75 ? 'text-green-700' : 'text-red-700'
              }`}>
                {recommendation.message}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceResult;
