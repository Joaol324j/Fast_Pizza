# Pizza API

Uma API RESTful para gerenciamento de pedidos de pizza, desenvolvida com Python e FastAPI. O sistema oferece uma solução completa para pizzarias, incluindo autenticação de usuários, gerenciamento de pedidos, menu de produtos com suporte a imagens, sistema de promoções, comentários e recuperação de senha via email.

## 🚀 Tecnologias Utilizadas

- Python 3.x
- FastAPI (Framework web)
- SQLAlchemy (ORM)
- PostgreSQL (Banco de dados)
- Docker & Docker Compose (Containerização)
- JWT (Autenticação)
- Jinja2 (Templates HTML)
- SMTP (Envio de emails)
- Pydantic (Validação de dados)
- OAuth2 (Autenticação)

## 📋 Pré-requisitos

- Python 3.8 ou superior
- Docker e Docker Compose
- pip (gerenciador de pacotes Python)
- Conta Gmail (para envio de emails)

## 🔧 Instalação

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pizza_API.git
```

2. Entre no diretório do projeto:
```bash
cd pizza_API
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` baseado no `.env.sample`:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/pizza_management
EMAIL_SENDER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
```

4. Inicie os containers:
```bash
docker-compose up --build
```

### Instalação Local

1. Crie e ative um ambiente virtual:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Configure as variáveis de ambiente como mostrado acima

4. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

## 📚 Estrutura do Projeto

```
pizza_API/
├── app/
│   ├── configs/         # Configurações da aplicação (banco de dados, etc)
│   ├── models/          # Modelos SQLAlchemy
│   ├── repositories/    # Camada de acesso a dados
│   ├── routes/          # Endpoints da API
│   ├── schemas/         # Schemas Pydantic para validação
│   ├── services/        # Lógica de negócios
│   ├── static/          # Arquivos estáticos (CSS, JS, imagens)
│   ├── templates/       # Templates HTML (login, registro, etc)
│   ├── utils/           # Utilitários (JWT, email, etc)
│   └── main.py          # Ponto de entrada da aplicação
├── docker-compose.yml   # Configuração Docker Compose
├── Dockerfile          # Configuração Docker
├── requirements.txt    # Dependências
└── README.md          # Este arquivo
```

## 📚 Funcionalidades

### Autenticação e Usuários
- Cadastro de usuários com validação de email
- Login com JWT (JSON Web Token)
- Recuperação de senha via email
- Proteção de rotas com autenticação OAuth2

### Menu de Produtos
- Cadastro de produtos com suporte a imagens
- Categorização de produtos
- Upload de imagens para produtos
- Listagem e busca de produtos

### Sistema de Promoções
- Criação de promoções para produtos
- Descontos percentuais e fixos
- Aplicação automática de promoções em pedidos
- Gerenciamento de promoções ativas

### Pedidos
- Criação de pedidos com múltiplos produtos
- Cálculo automático de totais com promoções
- Atualização de status de pedidos
- Histórico de pedidos

### Comentários e Avaliações
- Comentários em produtos
- Sistema de avaliação com notas
- Moderação de comentários
- Listagem de comentários por produto

## 📚 Endpoints da API

### Autenticação
- `POST /user/cadastro/` - Cadastro de novo usuário
- `POST /user/login/` - Login de usuário
- `POST /reset/solicitar-recuperacao/` - Solicita recuperação de senha
- `POST /reset/resetar-senha/{token}` - Redefine a senha

### Produtos
- `GET /produtos/` - Lista todos os produtos
- `GET /produtos/{produto_id}` - Obtém um produto específico
- `POST /produtos/` - Cria um novo produto (com suporte a imagem)
- `PUT /produtos/{produto_id}` - Atualiza um produto
- `DELETE /produtos/{produto_id}` - Remove um produto

### Promoções
- `GET /promocoes/` - Lista todas as promoções
- `GET /promocoes/{promocao_id}` - Obtém uma promoção específica
- `POST /promocoes/` - Cria uma nova promoção
- `PUT /promocoes/{promocao_id}` - Atualiza uma promoção
- `DELETE /promocoes/{promocao_id}` - Remove uma promoção

### Pedidos
- `POST /pedidos/` - Cria um novo pedido
- `GET /pedidos/` - Lista todos os pedidos
- `GET /pedidos/{pedido_id}` - Obtém um pedido específico
- `PUT /pedidos/{pedido_id}/status` - Atualiza o status do pedido
- `DELETE /pedidos/{pedido_id}` - Remove um pedido

### Comentários
- `POST /comentarios/` - Cria um novo comentário
- `GET /comentarios/{produto_id}/` - Lista comentários de um produto
- `PUT /comentarios/{comentario_id}/` - Atualiza um comentário
- `DELETE /comentarios/{comentario_id}/` - Remove um comentário

## 🧪 Testes

Para executar os testes:
```bash
pytest
```

## 🔒 Segurança

- Autenticação JWT com tokens de acesso
- Senhas criptografadas com bcrypt
- Proteção contra injeção SQL via SQLAlchemy
- Validação de dados com Pydantic
- Recuperação de senha segura via email

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para joaol324j@gmail.com ou abra uma issue no repositório.
