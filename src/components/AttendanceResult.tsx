
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isAbove75 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
              : 'bg-gradient-to-r from-orange-500 to-red-500'
          }`}>
            {isAbove75 ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="text-gray-800">Attendance Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{name}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{attended}</div>
              <div className="text-sm text-gray-600">Attended</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
          
          <div className="relative mb-6">
            <div className="text-5xl font-bold mb-3">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isAbove75 
                  ? 'from-emerald-600 to-green-600' 
                  : 'from-orange-600 to-red-600'
              }`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Badge 
              variant={isAbove75 ? "default" : "destructive"}
              className={`text-sm px-4 py-1 ${
                isAbove75 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              }`}
            >
              {isAbove75 ? 'Above 75%' : 'Below 75%'}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-700 ${
                isAbove75 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className={`p-5 rounded-xl border-2 ${
          isAbove75 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
        }`}>
          <div className="flex items-start gap-3">
            {isAbove75 ? (
              <TrendingUp className="w-6 h-6 mt-0.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-6 h-6 mt-0.5 text-orange-600" />
            )}
            <div>
              <p className={`font-bold text-lg mb-2 ${
                isAbove75 ? 'text-emerald-800' : 'text-orange-800'
              }`}>
                {recommendation.type === 'can_miss' ? 'Great Job! 🎉' : 'Action Needed! ⚡'}
              </p>
              <p className={`text-sm leading-relaxed ${
                isAbove75 ? 'text-emerald-700' : 'text-orange-700'
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
