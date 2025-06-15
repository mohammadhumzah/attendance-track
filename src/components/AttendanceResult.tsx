
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

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
    <Card className={`w-full max-w-md mx-auto border-4 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] pixel-card ${
      isAbove75 ? 'border-emerald-400' : 'border-orange-400'
    }`}>
      <CardHeader className={`pb-4 border-b-4 ${isAbove75 ? 'border-emerald-400' : 'border-orange-400'}`}>
        <CardTitle className="flex items-center gap-3">
          <div className={`w-8 h-8 flex items-center justify-center border-2 pixel-icon ${
            isAbove75 
              ? 'bg-emerald-400 border-emerald-300' 
              : 'bg-orange-400 border-orange-300'
          }`}>
            <span className="text-slate-900 text-xl">
              {isAbove75 ? '✓' : '!'}
            </span>
          </div>
          <span className={`font-mono text-lg uppercase tracking-wider ${
            isAbove75 ? 'text-emerald-400' : 'text-orange-400'
          }`}>
            ATTENDANCE REPORT
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-emerald-100 mb-2 font-mono uppercase tracking-wider">{name}</h3>
          {subject && (
            <div className="mb-6">
              <Badge className="bg-emerald-400 text-slate-900 font-mono text-sm border-2 border-emerald-300 pixel-badge uppercase">
                {subject}
              </Badge>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800 border-2 border-emerald-600 p-4 pixel-stat-box">
              <div className="text-3xl font-bold text-emerald-400 font-mono">{attended}</div>
              <div className="text-xs text-emerald-300 font-mono uppercase tracking-wider">ATTENDED</div>
            </div>
            <div className="bg-slate-800 border-2 border-emerald-600 p-4 pixel-stat-box">
              <div className="text-3xl font-bold text-emerald-400 font-mono">{total}</div>
              <div className="text-xs text-emerald-300 font-mono uppercase tracking-wider">TOTAL</div>
            </div>
          </div>
          
          <div className="relative mb-8">
            <div className="text-6xl font-bold mb-4 font-mono">
              <span className={`${
                isAbove75 
                  ? 'text-emerald-400' 
                  : 'text-orange-400'
              }`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className={`inline-block px-4 py-2 border-2 font-mono text-sm font-bold uppercase tracking-wider ${
              isAbove75 
                ? 'bg-emerald-400 text-slate-900 border-emerald-300' 
                : 'bg-orange-400 text-slate-900 border-orange-300'
            } pixel-badge`}>
              {isAbove75 ? 'ABOVE 75%' : 'BELOW 75%'}
            </div>
          </div>
          
          {/* Pixel Art Progress Bar */}
          <div className="w-full h-8 bg-slate-800 border-2 border-slate-600 mb-8 pixel-progress-container">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                isAbove75 
                  ? 'bg-emerald-400 border-r-2 border-emerald-300' 
                  : 'bg-orange-400 border-r-2 border-orange-300'
              } pixel-progress-bar`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            >
              <div className="w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
        
        <div className={`p-6 border-4 ${
          isAbove75 
            ? 'bg-emerald-900/30 border-emerald-400' 
            : 'bg-orange-900/30 border-orange-400'
        } pixel-recommendation-box`}>
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 flex items-center justify-center border-2 pixel-icon ${
              isAbove75 
                ? 'bg-emerald-400 border-emerald-300' 
                : 'bg-orange-400 border-orange-300'
            }`}>
              <span className="text-slate-900 text-lg">
                {isAbove75 ? '↗' : '↘'}
              </span>
            </div>
            <div>
              <p className={`font-bold text-lg mb-3 font-mono uppercase tracking-wider ${
                isAbove75 ? 'text-emerald-400' : 'text-orange-400'
              }`}>
                {recommendation.type === 'can_miss' ? 'GREAT JOB!' : 'ACTION NEEDED!'}
              </p>
              <p className={`text-sm leading-relaxed font-mono ${
                isAbove75 ? 'text-emerald-300' : 'text-orange-300'
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
