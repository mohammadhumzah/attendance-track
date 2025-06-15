
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Calculator, Factory, DollarSign, Dna, FlaskConical, TestTube, GraduationCap, Plus } from 'lucide-react';
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

const subjects = [
  {
    code: 'pre-project',
    name: 'Pre-project work',
    icon: Book,
    path: '/subject/pre-project'
  },
  {
    code: 'ces-414',
    name: 'CES-414 Seminar',
    icon: GraduationCap,
    path: '/subject/ces-414'
  },
  {
    code: 'cet-415',
    name: 'CET-415 Process Dynamics & Control',
    icon: Calculator,
    path: '/subject/cet-415'
  },
  {
    code: 'cet-416',
    name: 'CET-416 Process Economics & Plant Design',
    icon: DollarSign,
    path: '/subject/cet-416'
  },
  {
    code: 'cet-417',
    name: 'CET-417 Biochemical Engineering',
    icon: Dna,
    path: '/subject/cet-417'
  },
  {
    code: 'cel-418',
    name: 'CEL-418 Process Dynamics & Control Lab',
    icon: FlaskConical,
    path: '/subject/cel-418'
  },
  {
    code: 'cel-419',
    name: 'CEL-419 Mass Transfer Lab',
    icon: TestTube,
    path: '/subject/cel-419'
  },
  {
    code: 'cet-020-24',
    name: 'CET-020-24 Elective – I',
    icon: Plus,
    path: '/subject/cet-020-24'
  },
  {
    code: 'cet-025-29',
    name: 'CET-025-29 Elective – II',
    icon: Factory,
    path: '/subject/cet-025-29'
  }
];

export function SubjectSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r-4 border-emerald-600 bg-slate-900">
      <SidebarHeader className="border-b-4 border-emerald-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 border-2 border-emerald-300 flex items-center justify-center pixel-icon">
            <span className="text-slate-900 text-lg font-bold">7</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-emerald-400 font-mono font-bold text-lg uppercase tracking-wider">
                7th Semester
              </h2>
              <p className="text-emerald-300 font-mono text-xs uppercase tracking-wider">
                Select Subject
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-400 font-mono uppercase tracking-wider">
            Subjects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {subjects.map((subject) => (
                <SidebarMenuItem key={subject.code}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={subject.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 transition-colors font-mono ${
                          isActive
                            ? 'bg-emerald-400 text-slate-900 border-2 border-emerald-300'
                            : 'text-emerald-300 hover:bg-slate-800 hover:text-emerald-400 border-2 border-transparent'
                        } pixel-button`
                      }
                    >
                      <subject.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-xs uppercase tracking-wider truncate">
                          {subject.name}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
