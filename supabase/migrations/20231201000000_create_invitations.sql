-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view invitations
CREATE POLICY "Enable read access for authenticated users"
    ON public.invitations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to create invitations
CREATE POLICY "Enable insert access for authenticated users"
    ON public.invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS invitations_email_idx ON public.invitations (email);
