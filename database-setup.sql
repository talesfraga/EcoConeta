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
  email TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  foto_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- SEÇÃO 2: ADICIONAR CONSTRAINTS (execute depois das tabelas serem criadas)
-- ===========================================

-- Adicionar constraint de status na tabela denuncias
ALTER TABLE denuncias ADD CONSTRAINT check_status
CHECK (status IN ('pendente', 'em analise', 'resolvido'));

-- ===========================================
-- SEÇÃO 3: CRIAR ÍNDICES (execute depois das tabelas serem criadas)
-- ===========================================

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_denuncias_status ON denuncias(status);
CREATE INDEX IF NOT EXISTS idx_denuncias_created_at ON denuncias(created_at DESC);

-- ===========================================
-- SEÇÃO 4: CONFIGURAR SEGURANÇA (execute por último)
-- ===========================================

-- Configurar Row Level Security (RLS)
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;

-- Políticas para chat_history (usuários podem ver apenas seu histórico)
CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para denuncias (todos podem ver, apenas usuários logados podem inserir)
CREATE POLICY "Anyone can view denuncias" ON denuncias
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert denuncias" ON denuncias
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ===========================================
-- SEÇÃO 5: STORAGE BUCKET (criar via dashboard)
-- ===========================================

-- Configurar Storage bucket para fotos das denúncias
-- Isso deve ser feito via dashboard do Supabase:
-- Storage > Create bucket "denuncias-fotos" com configurações:
-- - Public bucket: true
-- - File size limit: 5MB
-- - Allowed MIME types: image/*