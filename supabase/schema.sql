-- Create tables
CREATE TABLE public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  level TEXT,
  schedule TEXT,
  location TEXT,
  status TEXT DEFAULT 'Ativa',
  icon TEXT DEFAULT 'BookOpen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own classes" 
  ON public.classes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classes" 
  ON public.classes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classes" 
  ON public.classes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classes" 
  ON public.classes FOR DELETE 
  USING (auth.uid() = user_id);

-- Se precisar de encontros, atividades e catequizandos depois: 
-- As tabelas abaixo foram omitidas intencionalmente neste momento
-- a pedido da limpeza dos módulos pelo usuário.
