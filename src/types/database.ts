import { ClassSession } from './sgu';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  career?: string;
}

export interface DBResponseSchedule {
  id: string;
  user_id: string;
  title: string;
  academic_period?: string;
  faculty?: string;
  schedule_data: ClassSession[];
  created_at: string;
}
