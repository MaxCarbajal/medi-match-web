
CREATE TABLE public.recommendation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  usuario TEXT,
  poliza TEXT NOT NULL,
  paciente TEXT NOT NULL,
  documento TEXT,
  ciudad TEXT,
  tratamiento TEXT,
  tipo_servicio TEXT,
  json_request JSONB NOT NULL,
  json_response JSONB NOT NULL
);

GRANT SELECT, INSERT ON public.recommendation_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendation_requests TO authenticated;
GRANT ALL ON public.recommendation_requests TO service_role;

ALTER TABLE public.recommendation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert recommendation requests"
  ON public.recommendation_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read recommendation requests"
  ON public.recommendation_requests FOR SELECT
  USING (true);

CREATE INDEX idx_recommendation_requests_created_at
  ON public.recommendation_requests (created_at DESC);
