
import { supabase } from '@/integrations/supabase/client';

// Track user signup information
export const trackUserSignup = async (signupMethod: 'email' | 'google') => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'No user found' };

  const { error } = await supabase
    .from('user_signups')
    .insert({
      user_id: user.id,
      signup_method: signupMethod,
      email_verified: user.email_confirmed_at ? true : false,
    });

  return { error };
};

// Save attendance entry to history
export const saveAttendanceEntry = async (attendanceData: {
  name: string;
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'No user found' };

  const { data, error } = await supabase
    .from('entries_history')
    .insert({
      user_id: user.id,
      entry_type: 'attendance_calculation',
      subject: attendanceData.subject,
      entry_data: attendanceData,
      entry_description: `${attendanceData.subject}: ${attendanceData.percentage.toFixed(1)}% attendance for ${attendanceData.name}`,
    })
    .select()
    .single();

  return { data, error };
};

// Get user's attendance history from Supabase
export const getAttendanceHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: [], error: 'No user found' };

  const { data, error } = await supabase
    .from('entries_history')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_type', 'attendance_calculation')
    .order('created_at', { ascending: false });

  return { data: data || [], error };
};

// Update attendance entry
export const updateAttendanceEntry = async (entryId: string, attendanceData: {
  name: string;
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}) => {
  const { data, error } = await supabase
    .from('entries_history')
    .update({
      entry_data: attendanceData,
      entry_description: `${attendanceData.subject}: ${attendanceData.percentage.toFixed(1)}% attendance for ${attendanceData.name}`,
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single();

  return { data, error };
};

// Delete attendance entry from Supabase
export const deleteAttendanceEntry = async (entryId: string) => {
  const { error } = await supabase
    .from('entries_history')
    .delete()
    .eq('id', entryId);

  return { error };
};
