-- Create shop_owner_documents table
CREATE TABLE IF NOT EXISTS public.shop_owner_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.shop_owner_registrations(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shop_owner_documents_registration_id ON public.shop_owner_documents(registration_id);
CREATE INDEX IF NOT EXISTS idx_shop_owner_documents_document_type ON public.shop_owner_documents(document_type);

-- Create trigger for updated_at
CREATE TRIGGER update_shop_owner_documents_updated_at
BEFORE UPDATE ON public.shop_owner_documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Grant permissions
ALTER TABLE public.shop_owner_documents ENABLE ROW LEVEL SECURITY;

-- Policy for admins (full access)
CREATE POLICY admin_all_access_shop_owner_documents
  ON public.shop_owner_documents
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy for users (can only access their own documents)
CREATE POLICY user_own_access_shop_owner_documents
  ON public.shop_owner_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shop_owner_registrations
      WHERE shop_owner_registrations.id = registration_id
      AND shop_owner_registrations.user_id = auth.uid()
    )
  );
