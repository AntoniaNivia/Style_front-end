# 🚀 Setup StyleWise - Frontend + Backend

## Passos para conectar Frontend com Backend

### 1. 📁 Estrutura de Arquivos
Certifique-se de que você tem a seguinte estrutura:
```
Style_front-end/
├── src/
├── package.json
└── .env.local

stylewise-backend/
├── src/
├── package.json
└── .env.example
```

### 2. 🔧 Configurar Backend

#### 2.1 Entrar na pasta do backend:
```bash
cd stylewise-backend
```

#### 2.2 Instalar dependências:
```bash
npm install
```

#### 2.3 Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

#### 2.4 Editar o arquivo `.env` com suas credenciais:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/stylewise"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Supabase
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Google AI
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

#### 2.5 Configurar banco de dados:
```bash
npm run db:generate
npm run db:migrate
```

#### 2.6 Iniciar o backend:
```bash
npm run dev
```
O backend está hospedado no Render em: https://style-back-end.onrender.com

### 3. 🎨 Configurar Frontend

#### 3.1 Entrar na pasta do frontend:
```bash
cd Style_front-end
```

#### 3.2 Instalar dependências:
```bash
npm install
```

#### 3.3 Verificar arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://style-back-end.onrender.com/api
NODE_ENV=development
```

#### 3.4 Iniciar o frontend:
```bash
npm run dev
```
O frontend estará rodando em: http://localhost:9002

### 4. ✅ Testar Conexão

1. Acesse http://localhost:9002
2. No dashboard, você verá um card "Conexão Backend"
3. Clique em "Testar Conexão"
4. Se tudo estiver certo, você verá "Conectado" ✅

### 5. 🔑 Credenciais Necessárias

Para funcionar completamente, você precisa:

#### Supabase:
1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Copiar URL e chaves da API
4. Criar bucket de storage "stylewise-images"

#### Google AI:
1. Criar projeto no Google Cloud Console
2. Ativar Generative AI API
3. Criar chave de API
4. Copiar para GOOGLE_AI_API_KEY

#### PostgreSQL:
- Use o Supabase como banco (já incluso)
- Ou configure PostgreSQL local

### 6. 🐛 Troubleshooting

#### Backend não conecta:
- Verifique se a porta 3001 está livre
- Confirme que todas as env vars estão configuradas
- Teste: `curl https://style-back-end.onrender.com/api/health`

#### Frontend não conecta:
- Verifique o .env.local
- Confirme que o backend está rodando
- Abra DevTools e veja erros de console

#### Banco de dados:
- Verifique conexão PostgreSQL
- Execute as migrações novamente
- Confirme DATABASE_URL

### 7. 📱 Fluxo de Teste

1. **Registro**: Criar conta de usuário
2. **Login**: Fazer login
3. **Wardrobe**: Adicionar foto de roupa
4. **AI Analysis**: Ver análise automática da IA
5. **Builder**: Gerar look com IA
6. **Feed**: Ver posts de lojas

**🎉 Pronto! StyleWise funcionando com IA integrada!**
