import React, { useState, useEffect } from 'react';
import AttendanceForm from '@/components/AttendanceForm';
import AttendanceResult from '@/components/AttendanceResult';
import AttendanceHistory, { AttendanceRecord } from '@/components/AttendanceHistory';
import Header from '@/components/Header';
import { calculateAttendance } from '@/utils/attendanceCalculator';
import { 
  saveAttendanceEntry, 
  getAttendanceHistory, 
  updateAttendanceEntry,
  deleteAttendanceEntry 
} from '@/utils/supabaseUtils';
import { useToast } from '@/hooks/use-toast';
import { Linkedin, Github } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

const Index = () => {
  const [currentResult, setCurrentResult] = useState<{
    name: string;
    subject: string;
    attended: number;
    total: number;
    percentage: number;
    recommendation: {
      type: 'can_miss' | 'need_attend';
      classes: number;
      message: string;
    };
  } | null>(null);
  
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAttendanceHistory();
  }, []);

  const loadAttendanceHistory = async () => {
    setLoading(true);
    const { data, error } = await getAttendanceHistory();
    
    if (error) {
      console.error('Error loading attendance history:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance history.",
        variant: "destructive",
      });
    } else {
      // Convert Supabase data to AttendanceRecord format
      const formattedRecords: AttendanceRecord[] = data.map(entry => ({
        id: entry.id,
        name: entry.entry_data.name,
        subject: entry.entry_data.subject || entry.subject,
        attended: entry.entry_data.attended,
        total: entry.entry_data.total,
        percentage: entry.entry_data.percentage,
        date: entry.created_at,
      }));
      setRecords(formattedRecords);
    }
    setLoading(false);
  };

  const handleFormSubmit = async (data: {
    name: string;
    subject: string;
    attended: number;
    total: number;
  }) => {
    const calculation = calculateAttendance(data.attended, data.total);
    
    const result = {
      ...data,
      percentage: calculation.percentage,
      recommendation: calculation.recommendation,
    };
    
    setCurrentResult(result);
    
    // Save to Supabase
    const { data: savedRecord, error } = await saveAttendanceEntry({
      name: data.name,
      subject: data.subject,
      attended: data.attended,
      total: data.total,
      percentage: calculation.percentage,
    });
    
    if (error) {
      console.error('Error saving attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance record.",
        variant: "destructive",
      });
    } else {
      // Reload the history to get the latest data
      loadAttendanceHistory();
      
      toast({
        title: "Attendance Calculated!",
        description: `${data.subject}: ${calculation.percentage.toFixed(1)}% attendance`,
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    const { error } = await deleteAttendanceEntry(id);
    
    if (error) {
      console.error('Error deleting attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to delete attendance record.",
        variant: "destructive",
      });
    } else {
      setRecords(prev => prev.filter(record => record.id !== id));
      
      toast({
        title: "Record Deleted",
        description: "Attendance record has been removed.",
      });
    }
  };

  const handleUpdateRecord = async (record: AttendanceRecord) => {
    const { error } = await updateAttendanceEntry(record.id, {
      name: record.name,
      subject: record.subject,
      attended: record.attended,
      total: record.total,
      percentage: record.percentage,
    });
    
    if (error) {
      console.error('Error updating attendance record:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance record.",
        variant: "destructive",
      });
    } else {
      // Update the local state
      setRecords(prev => 
        prev.map(r => r.id === record.id ? record : r)
      );
      
      toast({
        title: "Record Updated",
        description: `${record.subject}: Updated to ${record.percentage.toFixed(1)}%`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 bg-blue-50 dark:bg-blue-950/20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-foreground rounded-2xl mb-6">
            <span className="text-background text-2xl">📊</span>
          </div>
          <h1 className="text-4xl font-semibold text-foreground mb-4 nothing-text heading">
            Attendance Tracker
          </h1>
          <p className="text-muted-foreground text-lg nothing-text max-w-2xl mx-auto">
            Track your attendance with precision and clarity
          </p>
        </div>

        {/* Quick Access Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-foreground mb-2 nothing-text heading">
              Chemical Engineering
            </h2>
            <p className="text-muted-foreground text-sm nothing-text">
              Quick access to semester subjects
            </p>
          </div>
          
          <Accordion type="multiple" className="space-y-4">
            {/* 5th Semester */}
            <AccordionItem value="5th-sem" className="nothing-accordion rounded-xl border-0">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <span className="text-lg font-medium text-foreground nothing-text">5th Semester</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-muted-foreground text-sm mb-4 nothing-text">
                  Click on any subject to track its attendance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { code: 'cet-305', name: 'Process Equipment Design– I' },
                    { code: 'cet-306', name: 'Chemical Reaction Engineering' },
                    { code: 'cet-307', name: 'Mass Transfer-I' },
                    { code: 'cet-308', name: 'Chemical Technology – I' },
                    { code: 'hst-309', name: 'Basic Management Principles' },
                    { code: 'mat-310', name: 'Numerical Methods' },
                    { code: 'cel-311', name: 'Heat Transfer Lab' },
                    { code: 'cel-312', name: 'Computer Simulation Lab' }
                  ].map((subject) => (
                    <a
                      key={subject.code}
                      href={`/subject/${subject.code}`}
                      className="block p-4 bg-muted hover:bg-accent rounded-lg transition-colors nothing-glow"
                    >
                      <span className="text-sm text-foreground nothing-text block">
                        {subject.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 6th Semester */}
            <AccordionItem value="6th-sem" className="nothing-accordion rounded-xl border-0">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center text-sm font-medium">
                    6
                  </div>
                  <span className="text-lg font-medium text-foreground nothing-text">6th Semester</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-muted-foreground text-sm mb-4 nothing-text">
                  Click on any subject to track its attendance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { code: 'cet-355', name: 'Process Equipment Design -II' },
                    { code: 'cet-356', name: 'Mass Transfer – II' },
                    { code: 'cet-357', name: 'Chemical Technology – II' },
                    { code: 'cet-358', name: 'Energy Technology' },
                    { code: 'cet-359', name: 'Chemical Process Safety' },
                    { code: 'cet-360', name: 'Transport Phenomena' },
                    { code: 'cel-361', name: 'Energy Technology Lab' },
                    { code: 'cel-362', name: 'Thermodynamics & Reaction Engineering Lab' },
                    { code: 'cei-363', name: 'Industrial Training & Presentation' }
                  ].map((subject) => (
                    <a
                      key={subject.code}
                      href={`/subject/${subject.code}`}
                      className="block p-4 bg-muted hover:bg-accent rounded-lg transition-colors nothing-glow"
                    >
                      <span className="text-sm text-foreground nothing-text block">
                        {subject.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 7th Semester */}
            <AccordionItem value="7th-sem" className="nothing-accordion rounded-xl border-0">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center text-sm font-medium">
                    7
                  </div>
                  <span className="text-lg font-medium text-foreground nothing-text">7th Semester</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-muted-foreground text-sm mb-4 nothing-text">
                  Click on any subject to track its attendance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { code: 'pre-project', name: 'Pre-project work' },
                    { code: 'ces-414', name: 'CES-414 Seminar' },
                    { code: 'cet-415', name: 'CET-415 Process Dynamics' },
                    { code: 'cet-416', name: 'CET-416 Process Economics' },
                    { code: 'cet-417', name: 'CET-417 Biochemical Engineering' },
                    { code: 'cel-418', name: 'CEL-418 Process Dynamics Lab' },
                    { code: 'cel-419', name: 'CEL-419 Mass Transfer Lab' },
                    { code: 'cet-020-24', name: 'CET-020-24 Elective – I' },
                    { code: 'cet-025-29', name: 'CET-025-29 Elective – II' }
                  ].map((subject) => (
                    <a
                      key={subject.code}
                      href={`/subject/${subject.code}`}
                      className="block p-4 bg-muted hover:bg-accent rounded-lg transition-colors nothing-glow"
                    >
                      <span className="text-sm text-foreground nothing-text block">
                        {subject.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 8th Semester */}
            <AccordionItem value="8th-sem" className="nothing-accordion rounded-xl border-0">
              <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center text-sm font-medium">
                    8
                  </div>
                  <span className="text-lg font-medium text-foreground nothing-text">8th Semester</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-muted-foreground text-sm mb-4 nothing-text">
                  Click on any subject to track its attendance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { code: 'cet-465', name: 'Project Work' },
                    { code: 'cel-466', name: 'Biochemical Engineering Lab' },
                    { code: 'cet-467', name: 'Modeling & Simulation of Chemical Process Systems' },
                    { code: 'cet-468', name: 'Industrial Pollution Abatement' },
                    { code: 'cet-069-72', name: 'Elective – III' },
                    { code: 'cet-073-76', name: 'Elective – IV' }
                  ].map((subject) => (
                    <a
                      key={subject.code}
                      href={`/subject/${subject.code}`}
                      className="block p-4 bg-muted hover:bg-accent rounded-lg transition-colors nothing-glow"
                    >
                      <span className="text-sm text-foreground nothing-text block">
                        {subject.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Form Section */}
          <div className="mb-12">
            <AttendanceForm onSubmit={handleFormSubmit} />
          </div>

          {/* Result Section */}
          {currentResult && (
            <div className="mb-12">
              <AttendanceResult
                name={currentResult.name}
                attended={currentResult.attended}
                total={currentResult.total}
                percentage={currentResult.percentage}
                recommendation={currentResult.recommendation}
              />
            </div>
          )}
          
          {/* History Section */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-xl mb-4">
                <span className="text-xl">📊</span>
              </div>
              <p className="text-muted-foreground nothing-text">Loading attendance history...</p>
            </div>
          ) : (
            <AttendanceHistory
              records={records}
              onDeleteRecord={handleDeleteRecord}
              onUpdateRecord={handleUpdateRecord}
            />
          )}
          
          {/* Info Section */}
          <div className="mt-16 text-center">
            <div className="nothing-card p-8 max-w-lg mx-auto">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-muted rounded-lg mb-4">
                <span className="text-muted-foreground text-lg">💡</span>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-3 nothing-text heading">
                Pro Tip
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed nothing-text">
                Most institutions require 75% attendance. Use quick update buttons (+/-) 
                to track new classes or edit records manually for precise control.
              </p>
            </div>
          </div>

          {/* Credit Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground text-sm nothing-text">
                Built by Mohammad Humzah
              </p>
              <div className="flex justify-center gap-6">
                <a
                  href="https://www.linkedin.com/in/mohammadhumzah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm nothing-text"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/mohammadhumzah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm nothing-text"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
