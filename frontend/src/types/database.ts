import { ClassSession } from './sgu';

export type SubscriptionStatus = 'none' | 'pending_verification' | 'active';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  career?: string;
  sub_status?: SubscriptionStatus;
  sub_payment_receipt_url?: string;
  sub_expires_at?: string;
}

export interface PaymentVerification {
  id: string;
  user_id: string;
  receipt_url?: string;
  transaction_code?: string;
  status: SubscriptionStatus;
  amount?: number;
  created_at: string;
  updated_at: string;
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
