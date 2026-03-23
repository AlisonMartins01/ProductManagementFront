# API Endpoints – ProductManagement

Base URL: `http://localhost:8080/api`

---

## Produtos

### GET /products
Lista todos os produtos com paginação e filtro opcional por nome.

**Query Parameters**

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `name` | string | Não | — | Filtra produtos cujo nome contenha o valor informado |
| `page` | int | Não | `1` | Número da página |
| `pageSize` | int | Não | `10` | Quantidade de itens por página |

**Exemplo de requisição**
```
GET /api/products?name=notebook&page=1&pageSize=5
```

**Resposta 200 OK**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Notebook Pro",
      "description": "Notebook de alto desempenho",
      "price": 4999.99,
      "stockQuantity": 10,
      "createdAt": "2026-03-23T10:00:00Z",
      "updatedAt": "2026-03-23T10:00:00Z"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 5,
  "totalPages": 1
}
```

---

### GET /products/{id}
Busca um produto pelo ID.

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | int | ID do produto |

**Exemplo de requisição**
```
GET /api/products/1
```

**Resposta 200 OK**
```json
{
  "id": 1,
  "name": "Notebook Pro",
  "description": "Notebook de alto desempenho",
  "price": 4999.99,
  "stockQuantity": 10,
  "createdAt": "2026-03-23T10:00:00Z",
  "updatedAt": "2026-03-23T10:00:00Z"
}
```

**Resposta 404 Not Found**
```json
(sem corpo)
```

---

### POST /products
Cria um novo produto.

**Request Body** `application/json`

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | string | Sim | Máximo 200 caracteres |
| `description` | string | Não | Máximo 1000 caracteres |
| `price` | decimal | Sim | Maior que zero |
| `stockQuantity` | int | Sim | Maior ou igual a zero |

**Exemplo de requisição**
```json
{
  "name": "Notebook Pro",
  "description": "Notebook de alto desempenho",
  "price": 4999.99,
  "stockQuantity": 10
}
```

**Resposta 201 Created**
```json
{
  "id": 1,
  "name": "Notebook Pro",
  "description": "Notebook de alto desempenho",
  "price": 4999.99,
  "stockQuantity": 10,
  "createdAt": "2026-03-23T10:00:00Z",
  "updatedAt": "2026-03-23T10:00:00Z"
}
```

**Resposta 400 Bad Request** (validação)
```json
{
  "errors": {
    "Price": ["Price must be greater than zero."],
    "Name": ["Name is required."]
  }
}
```

---

### PUT /products/{id}
Atualiza um produto existente.

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | int | ID do produto a atualizar |

**Request Body** `application/json`

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `name` | string | Sim | Máximo 200 caracteres |
| `description` | string | Não | Máximo 1000 caracteres |
| `price` | decimal | Sim | Maior que zero |
| `stockQuantity` | int | Sim | Maior ou igual a zero |

**Exemplo de requisição**
```
PUT /api/products/1
```
```json
{
  "name": "Notebook Pro Max",
  "description": "Versão atualizada com mais memória",
  "price": 5999.99,
  "stockQuantity": 5
}
```

**Resposta 200 OK**
```json
{
  "id": 1,
  "name": "Notebook Pro Max",
  "description": "Versão atualizada com mais memória",
  "price": 5999.99,
  "stockQuantity": 5,
  "createdAt": "2026-03-23T10:00:00Z",
  "updatedAt": "2026-03-23T11:30:00Z"
}
```

**Resposta 404 Not Found**
```json
(sem corpo)
```

**Resposta 400 Bad Request** (validação)
```json
{
  "errors": {
    "Price": ["Price must be greater than zero."]
  }
}
```

---

### DELETE /products/{id}
Remove um produto pelo ID.

**Path Parameters**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | int | ID do produto a remover |

**Exemplo de requisição**
```
DELETE /api/products/1
```

**Resposta 204 No Content**
```
(sem corpo)
```

**Resposta 404 Not Found**
```
(sem corpo)
```

---

## Códigos de Status

| Código | Significado |
|--------|-------------|
| `200 OK` | Requisição bem-sucedida |
| `201 Created` | Recurso criado com sucesso |
| `204 No Content` | Operação bem-sucedida sem conteúdo de retorno |
| `400 Bad Request` | Dados inválidos — verifique as mensagens de validação |
| `404 Not Found` | Produto não encontrado |
| `500 Internal Server Error` | Erro inesperado no servidor |

---

## Erros 500 — Formato padrão

Todos os erros internos são capturados pelo middleware global e retornam:

```json
{
  "status": 500,
  "message": "An unexpected error occurred.",
  "detail": "mensagem técnica do erro"
}
```
