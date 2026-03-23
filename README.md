# Gestão de Produtos — Frontend

Aplicação Angular para gerenciamento de produtos, desenvolvida como parte de um desafio técnico Sênior Full Stack (.NET + Angular).

## Tecnologias

- Angular 20 (Standalone Components)
- Angular Material 20 (Material 3)
- Reactive Forms + RxJS
- TypeScript
- Docker + Nginx

## Funcionalidades

- Listagem de produtos com paginação e filtro por nome
- Criação e edição de produtos com formulários reativos e validações
- Exclusão com confirmação via dialog
- Tratamento global de erros HTTP (400, 404, 500)
- Indicador de loading automático em todas as requisições
- Guard para evitar saída de formulário com alterações não salvas
- Locale PT-BR (moeda, formatação)

## Pré-requisitos

- Node.js 22+
- Angular CLI 20+

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200`. A aplicação recarrega automaticamente a cada alteração.

> O backend deve estar rodando em `http://localhost:8080`. Para alterar a URL base, edite `src/environments/environment.ts`.

## Como rodar com Docker

### Apenas o frontend

```bash
docker build -t product-management-front .
docker run -p 4200:80 product-management-front
```

### Frontend + Backend juntos

```bash
docker-compose up --build
```

> No `docker-compose.yml`, o serviço `backend` usa `image: product-management-api`. Certifique-se de que a imagem do backend foi gerada antes de subir o compose.

## Build de produção

```bash
ng build --configuration=production
```

Os artefatos serão gerados em `dist/product-management/browser`.

## Testes

```bash
ng test
```

## Estrutura do projeto

```
src/app/
├── core/
│   ├── interceptors/       # HTTP error + loading interceptors
│   ├── services/           # LoadingService
│   └── guards/             # UnsavedChangesGuard
├── shared/
│   └── components/         # ConfirmDialogComponent
├── models/                 # Interfaces TypeScript
└── features/
    └── products/
        ├── product.service.ts
        ├── product-list/
        └── product-form/
```

## Decisões técnicas

- **Standalone Components** — padrão do Angular 20, sem NgModules
- **Lazy loading** — cada rota carrega seu bundle sob demanda
- **Interceptors funcionais** — registrados via `withInterceptors`, sem necessidade de classes
- **Erros do backend mapeados para o form** — erros de validação 400 são exibidos diretamente nos campos correspondentes
- **RxJS `combineLatest` + `switchMap`** — garante que mudança de página ou filtro cancela a requisição anterior

## O que faria diferente com mais tempo

- Testes unitários com maior cobertura (service, components, guards)
- Variável de ambiente para a URL da API configurável via Docker (sem rebuild)
- Feedback visual de estoque baixo mais elaborado (badge, alerta)
- Autenticação com JWT e refresh token
