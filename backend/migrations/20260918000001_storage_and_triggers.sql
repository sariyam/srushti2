-- ==============================================================================
-- SRUSHTI AI — STORAGE BUCKET & UPDATED_AT TRIGGERS
-- Migration Version: 20260918000001_storage_and_triggers.sql
-- Description: Updated_at auto-triggers and avatars public storage bucket
-- ==============================================================================

-- 1. Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Attach updated_at trigger to users table
DROP TRIGGER IF EXISTS set_users_updated_at ON "users";
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON "users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Attach updated_at trigger to payments table
DROP TRIGGER IF EXISTS set_payments_updated_at ON "payments";
CREATE TRIGGER set_payments_updated_at
    BEFORE UPDATE ON "payments"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Supabase Storage Bucket Initialization (avatars)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            true,
            5242880, -- 5 MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        )
        ON CONFLICT (id) DO UPDATE 
        SET public = true,
            file_size_limit = 5242880,
            allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    END IF;
END $$;

-- 5. Safe Storage Object Public Read Policy
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'objects'
    ) THEN
        -- Allow public read access to avatars bucket
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Avatars'
        ) THEN
            CREATE POLICY "Public Access for Avatars"
            ON storage.objects FOR SELECT
            USING (bucket_id = 'avatars');
        END IF;
    END IF;
END $$;
