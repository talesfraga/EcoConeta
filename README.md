# EcoConecta+ 🌿

Uma plataforma web para conscientização ambiental e denúncias ecológicas.

## Funcionalidades

- 🔐 **Autenticação**: Login/cadastro com Supabase Auth
- 💬 **EcoChat**: Chatbot ambiental com IA (Google Gemini)
- 🚨 **EcoDenúncia**: Sistema de denúncias ambientais com upload de fotos
- 🗺️ **EcoMapa**: Mapa interativo com pontos de reciclagem
- 📚 **EcoEducação**: Artigos e dicas sobre sustentabilidade

## Tecnologias

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **IA**: Google Gemini API
- **Mapa**: Leaflet.js
- **Storage**: Supabase Storage

## Configuração

### 1. Pré-requisitos

- Node.js instalado
- Conta no [Supabase](https://supabase.com)
- Chave da API do [Google Gemini](https://makersuite.google.com/app/apikey)

### 2. Clonagem e Instalação

```bash
git clone <seu-repositorio>
cd EcoConecta-v2
```

### 3. Configuração das Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
GEMINI_API_KEY=sua_gemini_api_key
```

### 4. Configuração do Banco de Dados

Execute o script SQL `database-setup.sql` no SQL Editor do Supabase:

1. Acesse seu projeto no Supabase
2. Vá para SQL Editor
3. Cole e execute o conteúdo do arquivo `database-setup.sql`

Ou crie as tabelas manualmente:

```sql
-- Tabela para histórico do chat
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para denúncias
CREATE TABLE denuncias (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  foto_url TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Configuração do Storage

1. No dashboard do Supabase, vá para **Storage**
2. Clique em **Create bucket**
3. Nome: `denuncias-fotos`
4. Marque como **Public bucket**
5. Configure:
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

### 6. Configuração das Edge Functions

Configure as variáveis de ambiente no Supabase:

1. Dashboard > Settings > Environment variables
2. Adicione:
   - `GEMINI_API_KEY`: Sua chave da API do Google Gemini

### 7. Deploy da Function

```bash
cd supabase
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase functions deploy chat
```

### 6. Executar o Projeto

Abra o arquivo `Front-end/index.html` no navegador ou use um servidor local:

```bash
cd Front-end
python -m http.server 8000
# Acesse: http://localhost:8000
```

## Estrutura do Projeto

```
EcoConecta-v2/
├── Front-end/
│   ├── index.html          # Página de login
│   ├── reset-password.html # Redefinição de senha
│   ├── html/
│   │   └── dashboard.html  # Dashboard principal
│   ├── css/
│   │   ├── global.css      # Estilos globais
│   │   └── dashboard.css   # Estilos do dashboard
│   ├── js/
│   │   ├── auth.js         # Autenticação
│   │   ├── dashboard.js    # Dashboard
│   │   ├── chat.js         # Chatbot
│   │   ├── denuncia.js     # Sistema de denúncias
│   │   ├── educacao.js     # Educação ambiental
│   │   ├── mapa.js         # Mapa interativo
│   │   └── supabase.js     # Configuração Supabase
│   └── src/img/            # Imagens
└── supabase/
    ├── config.toml         # Configuração Supabase
    └── functions/
        └── chat/
            ├── index.ts    # Edge Function do chat
            └── deno.json   # Configuração Deno
```

## Funcionalidades Detalhadas

### Autenticação
- Cadastro e login com e-mail/senha
- Recuperação de senha por e-mail
- Logout seguro

### EcoChat
- Chatbot alimentado por IA do Google Gemini
- Histórico de conversas por usuário
- Respostas em português sobre temas ambientais

### EcoDenúncia
- Formulário para registrar denúncias
- Upload de fotos para o Supabase Storage
- Feed público de denúncias
- Status de acompanhamento (pendente, em análise, resolvido)

### EcoMapa
- Mapa interativo com Leaflet.js
- Pontos de reciclagem, ecopontos e cooperativas
- Localização do usuário
- Popups com informações detalhadas

### EcoEducação
- Artigos sobre reciclagem, clima, consumo, energia e biodiversidade
- Sistema de filtros por categoria
- Modal com dicas detalhadas

## Desenvolvimento

### Comandos Úteis

```bash
# Iniciar Supabase local
supabase start

# Deploy das functions
supabase functions deploy chat

# Logs das functions
supabase functions logs chat

# Testar functions localmente
supabase functions serve chat
```

### Estrutura do Banco

As tabelas principais são:
- `chat_history`: Histórico das conversas do chatbot
- `denuncias`: Registro das denúncias ambientais

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

Para dúvidas ou sugestões, abra uma issue no GitHub.