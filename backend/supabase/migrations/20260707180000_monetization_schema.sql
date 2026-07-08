-- Create ENUM for subscription status
CREATE TYPE subscription_status AS ENUM ('none', 'pending_verification', 'active');

-- Extend the existing profiles table to hold the subscription state
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sub_status subscription_status DEFAULT 'none',
ADD COLUMN IF NOT EXISTS sub_payment_receipt_url TEXT,
ADD COLUMN IF NOT EXISTS sub_expires_at TIMESTAMP WITH TIME ZONE;

-- Create a table for payment verifications (specifically for Deuna! and bank transfers)
CREATE TABLE IF NOT EXISTS public.payment_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receipt_url TEXT,                  -- For the uploaded image of the transfer
    transaction_code TEXT,             -- For the Deuna! or bank reference code
    status subscription_status DEFAULT 'pending_verification',
    amount NUMERIC(10, 2),             -- E.g., 5.00 for the semester pass
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for payment_verifications
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Policies for payment_verifications
-- Users can insert their own payment verification
CREATE POLICY "Users can insert their own payment verifications" 
ON public.payment_verifications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can view their own payment verifications
CREATE POLICY "Users can view their own payment verifications" 
ON public.payment_verifications FOR SELECT 
USING (auth.uid() = user_id);

-- Create a bucket for payment receipts (if not exists, to be run in Supabase SQL Editor)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_receipts', 'payment_receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Users can upload their own payment receipts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment_receipts' AND auth.uid() = owner);

CREATE POLICY "Users can view their own payment receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment_receipts' AND auth.uid() = owner);
