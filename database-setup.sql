-- Script SQL para configurar o banco de dados do EcoConecta+
-- Execute este script no SQL Editor do Supabase
-- Execute uma seção por vez para evitar erros

-- ===========================================
-- SEÇÃO 1: CRIAR TABELAS
-- ===========================================

-- Criar tabela para histórico do chat
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para denúncias ambientais
CREATE TABLE IF NOT EXISTS denuncias (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  foto_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para pontos de coleta do EcoMapa
CREATE TABLE IF NOT EXISTS pontos_coleta (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  endereco TEXT NOT NULL,
  horario TEXT,
  materiais TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajustes para bancos ja criados antes desta versao
ALTER TABLE denuncias ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ===========================================
-- SEÇÃO 2: ADICIONAR CONSTRAINTS (execute depois das tabelas serem criadas)
-- ===========================================

-- Adicionar constraint de status na tabela denuncias
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_status'
  ) THEN
    ALTER TABLE denuncias ADD CONSTRAINT check_status
    CHECK (status IN ('pendente', 'em analise', 'resolvido'));
  END IF;
END $$;

-- Validacoes basicas para reduzir abuso no formulario publico autenticado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_denuncias_tamanho'
  ) THEN
    ALTER TABLE denuncias ADD CONSTRAINT check_denuncias_tamanho
    CHECK (
      char_length(email) <= 254
      AND char_length(titulo) BETWEEN 3 AND 120
      AND char_length(descricao) BETWEEN 10 AND 1200
    );
  END IF;
END $$;

-- Adicionar constraint de tipo na tabela pontos_coleta
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_pontos_coleta_tipo'
  ) THEN
    ALTER TABLE pontos_coleta ADD CONSTRAINT check_pontos_coleta_tipo
    CHECK (tipo IN ('reciclagem', 'ecoponto', 'cooperativa'));
  END IF;
END $$;

-- Evita duplicar os pontos iniciais ao reexecutar o script
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_pontos_coleta_nome'
  ) THEN
    ALTER TABLE pontos_coleta ADD CONSTRAINT unique_pontos_coleta_nome UNIQUE (nome);
  END IF;
END $$;

-- ===========================================
-- SEÇÃO 3: CRIAR ÍNDICES (execute depois das tabelas serem criadas)
-- ===========================================

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_denuncias_status ON denuncias(status);
CREATE INDEX IF NOT EXISTS idx_denuncias_created_at ON denuncias(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pontos_coleta_tipo ON pontos_coleta(tipo);

-- ===========================================
-- SEÇÃO 4: CONFIGURAR SEGURANÇA (execute por último)
-- ===========================================

-- Configurar Row Level Security (RLS)
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_coleta ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_history (usuários podem ver apenas seu histórico)
DROP POLICY IF EXISTS "Users can view their own chat history" ON chat_history;
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat history" ON chat_history;
CREATE POLICY "Users can insert their own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para denuncias (todos podem ver, apenas usuários logados podem inserir)
DROP POLICY IF EXISTS "Anyone can view denuncias" ON denuncias;
CREATE POLICY "Anyone can view denuncias" ON denuncias
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert denuncias" ON denuncias;
CREATE POLICY "Authenticated users can insert denuncias" ON denuncias
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );

-- Politicas para pontos_coleta (todos podem visualizar)
DROP POLICY IF EXISTS "Anyone can view pontos coleta" ON pontos_coleta;
CREATE POLICY "Anyone can view pontos coleta" ON pontos_coleta
  FOR SELECT USING (true);

-- Criar bucket publico para fotos das denuncias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('denuncias-fotos', 'denuncias-fotos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Politicas para Storage das fotos de denuncias
DROP POLICY IF EXISTS "Anyone can view denuncia photos" ON storage.objects;
CREATE POLICY "Anyone can view denuncia photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'denuncias-fotos');

DROP POLICY IF EXISTS "Authenticated users can upload denuncia photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload denuncia photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'denuncias-fotos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND lower((storage.extension(name))) IN ('jpg', 'jpeg', 'png', 'webp')
  );

-- Dados iniciais para o EcoMapa
DELETE FROM pontos_coleta
WHERE nome IN ('Ecoponto Centro', 'Cooperativa Verde', 'Ponto de Reciclagem Vila Madalena');

INSERT INTO pontos_coleta (nome, tipo, lat, lng, endereco, horario, materiais)
VALUES
  ('Ecoponto Vila Helena', 'ecoponto', -23.47699, -47.49332, 'Rua Roque Sampaio, 100 - Vila Helena, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('Ecoponto Cajuru', 'ecoponto', -23.39753, -47.38012, 'Rua Mario Monteiro de Carvalho, s/n - Cajuru do Sul, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('Ecoponto Julio de Mesquita Filho', 'ecoponto', -23.4747, -47.4698, 'Av. Domingos Martins Vieira, 100 - Julio de Mesquita Filho, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('Ecoponto Vila Hortencia', 'ecoponto', -23.5068, -47.4316, 'Rua Lourenco Molineiro, 200 - Vila Hortencia, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('Ecoponto Brigadeiro Tobias', 'ecoponto', -23.5491, -47.3543, 'Rua Jose Sarti, 636 - Brigadeiro Tobias, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('Ecoponto Aparecidinha', 'ecoponto', -23.4305, -47.3739, 'Rua Luiz Alberto Mitidieri com Estrada do Barreiro - Aparecidinha, Sorocaba/SP', 'Segunda a sexta, 7h as 17h; sabado, 7h as 12h', ARRAY['Entulho ate 1m3', 'Madeira', 'Moveis', 'Reciclaveis', 'Eletronicos']),
  ('CORESO', 'cooperativa', -23.5006, -47.4692, 'Rua Jose Henrique Dias, 215 - Sorocaba/SP', 'Consulte antes de levar materiais', ARRAY['Papel', 'Papelao', 'Plastico', 'Metal', 'Oleo de cozinha', 'Eletroeletronicos'])
ON CONFLICT (nome) DO UPDATE SET
  tipo = EXCLUDED.tipo,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  endereco = EXCLUDED.endereco,
  horario = EXCLUDED.horario,
  materiais = EXCLUDED.materiais;

-- ===========================================
-- SEÇÃO 5: STORAGE BUCKET (criar via dashboard)
-- ===========================================

-- Configurar Storage bucket para fotos das denúncias
-- Isso deve ser feito via dashboard do Supabase:
-- Storage > Create bucket "denuncias-fotos" com configurações:
-- - Public bucket: true
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp
