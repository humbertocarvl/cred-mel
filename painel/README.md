
# Painel Administrativo

Frontend para dashboard e gestão do evento.

## Principais tecnologias
- React + TypeScript + Vite + Tailwind
- Autenticação JWT
- Integração com backend
- Responsivo e seguro
- Pronto para deploy Railway

## Scripts úteis
- `npm run dev` — Inicia painel em modo desenvolvimento
- `npm run build` — Gera build de produção

## Estrutura de pastas
- `src/pages` — Páginas principais (Dashboard, Login, Usuários, Inscritas, Credenciadas)
- `src/components` — Componentes reutilizáveis (Navbar, etc.)
- `src/services` — Integração com backend (Axios)
- `src/hooks` — Hooks customizados (useAuth)
- `src/utils` — Utilitários

## Documentação resumida
- Dashboard: Quantidade de inscritas, credenciadas, alojadas, refeições servidas, detalhamento por data/tipo
- Usuários: Listar, criar, editar, ativar/desativar usuários do scanner
- Inscritas: Listar, editar, inserir novas inscritas via formulário
- Credenciadas: Listar inscritas credenciadas, desfazer credenciamento

## Deploy Railway
1. Configure variável de ambiente `VITE_API_URL` com a URL do backend
2. Execute `npm run build` para gerar build
3. Faça deploy do build gerado
