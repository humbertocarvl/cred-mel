
# Backend

API RESTful para credenciamento e refeições.

## Principais tecnologias
- Node.js + TypeScript + Express
- PostgreSQL (Prisma ORM)
- Redis (filas/cache)
- JWT para autenticação
- Auditoria de ações críticas
- Scripts de migração e seed
- Documentação da API
- Pronto para deploy Railway

## Scripts úteis
- `npx prisma migrate dev` — Executa migrações do banco
- `npx prisma generate` — Gera client Prisma
- `npm run dev` — Inicia servidor em modo desenvolvimento

## Deploy Railway
1. Configure variáveis de ambiente (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`).
2. Execute as migrações: `npx prisma migrate deploy`.
3. Inicie o servidor: `npm run start`.

## Estrutura de pastas
- `src/config` — Configurações de banco, Redis, Prisma
- `src/models` — Interfaces das entidades
- `src/controllers` — Lógica das rotas
- `src/routes` — Rotas da API
- `src/middlewares` — Middlewares (auth, etc.)
- `src/services` — Serviços (auditoria, filas)
- `src/utils` — Utilitários (hash, jwt)
- `src/jobs` — Processamento de filas

## Documentação da API
- Endpoints principais:
	- `/api/auth/login` — Login
	- `/api/auth/register` — Registro de usuário
	- `/api/users` — Gerenciamento de usuários
	- `/api/participants` — Gerenciamento de participantes
	- `/api/wristbands` — Vinculação de pulseiras
	- `/api/meals` — Registro de refeições
	- `/api/audit-logs` — Logs de auditoria

## Auditoria
Todas ações críticas são registradas na tabela `AuditLog`.

## Filas críticas
Operações de credenciamento e refeições usam Redis para garantir integridade e evitar concorrência.

## Extensibilidade
O sistema está pronto para novos tipos de registro (ex: atividades extras).
