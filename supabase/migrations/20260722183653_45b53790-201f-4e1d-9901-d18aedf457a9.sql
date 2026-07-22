
CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  hospital text NOT NULL,
  ciudad text NOT NULL,
  especialidades text[] NOT NULL DEFAULT '{}',
  distancia_km numeric NOT NULL,
  costo_estimado text NOT NULL,
  costo_nivel text NOT NULL,
  capacidad text NOT NULL,
  google_rating numeric NOT NULL,
  convenio boolean NOT NULL DEFAULT false,
  tiempo_urgencia_min int NOT NULL,
  tiempo_programado_min int NOT NULL,
  historial_aprobacion numeric NOT NULL DEFAULT 0.9
);

GRANT SELECT ON public.providers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.providers TO authenticated;
GRANT ALL ON public.providers TO service_role;

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read providers" ON public.providers FOR SELECT USING (true);

INSERT INTO public.providers (hospital, ciudad, especialidades, distancia_km, costo_estimado, costo_nivel, capacidad, google_rating, convenio, tiempo_urgencia_min, tiempo_programado_min, historial_aprobacion) VALUES
('Clínica Caracas', 'Caracas', ARRAY['Medicina General','Cardiología','Traumatología'], 2.3, '$1.850', '$$', 'Alta', 4.8, true, 12, 90, 0.96),
('Centro Médico La Trinidad', 'Caracas', ARRAY['Medicina General','Neurología','Oncología'], 4.2, '$2.340', '$$$', 'Media', 4.7, true, 18, 120, 0.93),
('Hospital Metropolitano', 'Caracas', ARRAY['Medicina General','Pediatría','Traumatología'], 6.8, '$1.620', '$$', 'Alta', 4.5, false, 22, 180, 0.88),
('Policlínica Metropolitana', 'Caracas', ARRAY['Medicina General','Cardiología'], 8.5, '$2.910', '$$$', 'Baja', 4.3, false, 28, 240, 0.82),
('Hospital de Clínicas Caracas', 'Caracas', ARRAY['Medicina General','Cirugía','Oncología'], 3.1, '$2.100', '$$$', 'Media', 4.6, true, 15, 100, 0.94),
('Centro Médico Valencia', 'Valencia', ARRAY['Medicina General','Pediatría','Traumatología'], 3.5, '$1.750', '$$', 'Alta', 4.6, true, 14, 95, 0.92);
