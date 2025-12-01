
# Scanner

Frontend para credenciamento, refeições e inscrição.

## Principais tecnologias
- React + TypeScript + Vite + Tailwind
- Leitura de QR Code via câmera (placeholder pronto para integração)
- Autenticação JWT
- Integração com backend
- Responsivo, compatível com celulares
- Pronto para deploy Railway

## Scripts úteis
- `npm run dev` — Inicia scanner em modo desenvolvimento
- `npm run build` — Gera build de produção

## Estrutura de pastas
- `src/pages` — Páginas principais (Credenciamento, Refeições, Inscrição)
- `src/components` — Componentes reutilizáveis (Navbar, QRCodeReader)
- `src/services` — Integração com backend (Axios)
- `src/hooks` — Hooks customizados (useAuth)
- `src/utils` — Utilitários

## Funcionalidades
- Credenciamento: leitura de QR Code, lista de inscritas não credenciadas, vinculação de pulseira
- Refeições: leitura de QR Code, registro de retirada, controle de duplicidade
- Inscrição: formulário para novas participantes

## Deploy Railway
1. Configure variável de ambiente `VITE_API_URL` com a URL do backend
2. Execute `npm run build` para gerar build
3. Faça deploy do build gerado
