
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Calculator, Factory, DollarSign, Dna, FlaskConical, TestTube, GraduationCap, Plus, Beaker, Wrench, Zap, Shield, Waves, Cpu, BarChart3, Microscope, Building, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const subjects = {
  '5th': [
    { code: 'cet-305', name: 'Process Equipment Design– I', icon: Wrench, path: '/subject/cet-305' },
    { code: 'cet-306', name: 'Chemical Reaction Engineering', icon: Beaker, path: '/subject/cet-306' },
    { code: 'cet-307', name: 'Mass Transfer-I', icon: Waves, path: '/subject/cet-307' },
    { code: 'cet-308', name: 'Chemical Technology – I', icon: Factory, path: '/subject/cet-308' },
    { code: 'hst-309', name: 'Basic Management Principles', icon: BarChart3, path: '/subject/hst-309' },
    { code: 'mat-310', name: 'Numerical Methods', icon: Calculator, path: '/subject/mat-310' },
    { code: 'cel-311', name: 'Heat Transfer Lab', icon: Zap, path: '/subject/cel-311' },
    { code: 'cel-312', name: 'Computer Simulation Lab', icon: Cpu, path: '/subject/cel-312' }
  ],
  '6th': [
    { code: 'cet-355', name: 'Process Equipment Design -II', icon: Wrench, path: '/subject/cet-355' },
    { code: 'cet-356', name: 'Mass Transfer – II', icon: Waves, path: '/subject/cet-356' },
    { code: 'cet-357', name: 'Chemical Technology – II', icon: Factory, path: '/subject/cet-357' },
    { code: 'cet-358', name: 'Energy Technology', icon: Zap, path: '/subject/cet-358' },
    { code: 'cet-359', name: 'Chemical Process Safety', icon: Shield, path: '/subject/cet-359' },
    { code: 'cet-360', name: 'Transport Phenomena', icon: Waves, path: '/subject/cet-360' },
    { code: 'cel-361', name: 'Energy Technology Lab', icon: FlaskConical, path: '/subject/cel-361' },
    { code: 'cel-362', name: 'Thermodynamics & Reaction Engineering Lab', icon: TestTube, path: '/subject/cel-362' },
    { code: 'cei-363', name: 'Industrial Training & Presentation', icon: Building, path: '/subject/cei-363' }
  ],
  '7th': [
    { code: 'pre-project', name: 'Pre-project work', icon: Book, path: '/subject/pre-project' },
    { code: 'ces-414', name: 'CES-414 Seminar', icon: GraduationCap, path: '/subject/ces-414' },
    { code: 'cet-415', name: 'CET-415 Process Dynamics', icon: Calculator, path: '/subject/cet-415' },
    { code: 'cet-416', name: 'CET-416 Process Economics', icon: DollarSign, path: '/subject/cet-416' },
    { code: 'cet-417', name: 'CET-417 Biochemical Engineering', icon: Dna, path: '/subject/cet-417' },
    { code: 'cel-418', name: 'CEL-418 Process Dynamics Lab', icon: FlaskConical, path: '/subject/cel-418' },
    { code: 'cel-419', name: 'CEL-419 Mass Transfer Lab', icon: TestTube, path: '/subject/cel-419' },
    { code: 'cet-020-24', name: 'CET-020-24 Elective – I', icon: Plus, path: '/subject/cet-020-24' },
    { code: 'cet-025-29', name: 'CET-025-29 Elective – II', icon: Factory, path: '/subject/cet-025-29' }
  ],
  '8th': [
    { code: 'cet-465', name: 'Project Work', icon: Book, path: '/subject/cet-465' },
    { code: 'cel-466', name: 'Biochemical Engineering Lab', icon: Microscope, path: '/subject/cel-466' },
    { code: 'cet-467', name: 'Modeling & Simulation of Chemical Process Systems', icon: Cpu, path: '/subject/cet-467' },
    { code: 'cet-468', name: 'Industrial Pollution Abatement', icon: Trash2, path: '/subject/cet-468' },
    { code: 'cet-069-72', name: 'Elective – III', icon: Plus, path: '/subject/cet-069-72' },
    { code: 'cet-073-76', name: 'Elective – IV', icon: Plus, path: '/subject/cet-073-76' }
  ]
};

export function SubjectSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  // State to track which semesters are expanded
  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({
    '5th': false,
    '6th': false,
    '7th': false,
    '8th': false,
  });

  const toggleSemester = (semester: string) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semester]: !prev[semester]
    }));
  };

  return (
    <Sidebar className="!bg-gray-900 border-r border-gray-700">
      <SidebarHeader className="border-b border-gray-700 p-4 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">📚</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-white font-semibold text-lg">
                Subjects
              </h2>
              <p className="text-gray-400 text-sm">
                Select a subject
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gray-900 p-2">
        {Object.entries(subjects).map(([semester, semesterSubjects]) => (
          <SidebarGroup key={semester} className="mb-2">
            <Collapsible
              open={expandedSemesters[semester]}
              onOpenChange={() => toggleSemester(semester)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="text-gray-300 font-medium text-sm mb-2 px-3 hover:text-white cursor-pointer flex items-center justify-between group">
                  <span>{semester} Semester</span>
                  {!isCollapsed && (
                    expandedSemesters[semester] ? 
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:text-blue-400" /> :
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:text-blue-400" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {semesterSubjects.map((subject) => (
                      <SidebarMenuItem key={subject.code}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={subject.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              }`
                            }
                          >
                            <subject.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                              <span className="text-sm font-medium leading-tight">
                                {subject.name}
                              </span>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
