# BarberHub Marketplace

Este é o frontend do projeto BarberHub Marketplace, desenvolvido com React, TypeScript e Vite.

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Router DOM
- React Query

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

3. Para build de produção:
```bash
npm run build
```

## Estrutura do Projeto

- `/src` - Código fonte principal do projeto
  - `/components` - Componentes reutilizáveis da interface, incluindo layouts, formulários, cards, filtros, calendário, navegação e componentes de UI (em `/components/ui`)
  - `/constants` - Constantes utilizadas no frontend (ex: categorias de serviços)
  - `/contexts` - Contextos React para gerenciamento de estado global (ex: autenticação)
  - `/hooks` - Hooks customizados para funcionalidades específicas
  - `/lib` - Utilitários e configurações, incluindo integração com API e funções auxiliares
  - `/pages` - Páginas da aplicação, organizadas por área (admin, barbearia, cliente, etc.)
  - `/services` - Serviços para comunicação com a API backend (ex: autenticação, agendamento, avaliações)
  - `/types` - Definições de tipos TypeScript compartilhados
  - `App.tsx` - Componente principal da aplicação
  - `main.tsx` - Ponto de entrada da aplicação
  - `index.css` e `App.css` - Estilos globais
- `/public` - Arquivos estáticos (imagens, ícones, etc.)
- `package.json` e `package-lock.json` - Dependências e scripts do projeto
- `vite.config.ts` - Configuração do Vite e proxy para backend
- `tailwind.config.ts` - Configuração do Tailwind CSS

## Integração com Backend

Este frontend está configurado para se comunicar com um backend Spring Boot. Certifique-se de que o backend está rodando na porta 8080 ou ajuste a configuração de proxy no `vite.config.ts` conforme necessário.
