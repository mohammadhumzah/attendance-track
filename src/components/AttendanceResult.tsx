
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface AttendanceResultProps {
  name: string;
  subject?: string;
  attended: number;
  total: number;
  percentage: number;
  recommendation: {
    type: 'can_miss' | 'need_attend';
    classes: number;
    message: string;
  };
}

const AttendanceResult = ({ name, subject, attended, total, percentage, recommendation }: AttendanceResultProps) => {
  const isAbove75 = percentage >= 75;
  
  return (
    <div className="w-full max-w-md mx-auto nothing-card nothing-glow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
            isAbove75 ? 'bg-black text-white' : 'bg-gray-600 text-white'
          }`}>
            <span className="text-sm">
              {isAbove75 ? '✓' : '!'}
            </span>
          </div>
          <h2 className="text-lg font-medium text-black nothing-text heading">
            Attendance Report
          </h2>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium text-black mb-2 nothing-text heading">
              {name}
            </h3>
            {subject && (
              <div className="mb-6">
                <span className="nothing-badge text-gray-600">
                  {subject}
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-black nothing-text heading">
                  {attended}
                </div>
                <div className="text-xs text-gray-600 nothing-text">
                  ATTENDED
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-black nothing-text heading">
                  {total}
                </div>
                <div className="text-xs text-gray-600 nothing-text">
                  TOTAL
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="text-4xl font-semibold mb-4 nothing-text heading">
                <span className={`${isAbove75 ? 'text-black' : 'text-gray-600'}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                isAbove75 
                  ? 'bg-black text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {isAbove75 ? 'ABOVE 75%' : 'BELOW 75%'}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="nothing-progress h-2 mb-8">
              <div 
                className={`nothing-progress-bar ${
                  isAbove75 ? 'bg-black' : 'bg-gray-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isAbove75 
              ? 'bg-gray-50 border border-gray-100' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                isAbove75 
                  ? 'bg-black text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {isAbove75 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium text-sm mb-2 nothing-text heading ${
                  isAbove75 ? 'text-black' : 'text-gray-800'
                }`}>
                  {recommendation.type === 'can_miss' ? 'Great Job!' : 'Action Needed!'}
                </p>
                <p className={`text-sm leading-relaxed nothing-text ${
                  isAbove75 ? 'text-gray-700' : 'text-gray-600'
                }`}>
                  {recommendation.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceResult;
