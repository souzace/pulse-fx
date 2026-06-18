# Pulse FX

Monorepo para monitoramento de câmbio e indicadores de economia.

---

## Fluxo de Execução (Docker Compose)

Siga a sequência de passos para inicializar a aplicação e o banco de dados.

### Passo 1: Configuração de Variáveis de Ambiente

Crie os arquivos `.env` e `.env.test` a partir dos modelos do repositório.

**Configuração do Backend:**
Copie o arquivo de exemplo no diretório do backend:
```bash
cp apps/backend/.env.example apps/backend/.env
```
Abra o arquivo `apps/backend/.env` e insira a chave da API do FRED:
```env
PORT=3333
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_DATABASE=pulse_fx
#keep to be compatible with node-pg-migrate lib
DATABASE_URL=postgresql://postgres:password@database:5432/pulse_fx
FRED_API_KEY=insira_sua_chave_aqui
```

**Configuração de Testes (Backend):**
Copie o arquivo de exemplo de testes no diretório do backend:
```bash
cp apps/backend/.env.test.sample apps/backend/.env.test
```
Abra o arquivo `apps/backend/.env.test` e insira as credenciais do banco de testes:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=xxxxx
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=pulse_fx_test
#keep to be compatible with node-pg-migrate lib
DATABASE_URL=postgresql://postgres:password@database:5432/pulse_fx_test
```

**Configuração do Frontend:**
Copie o arquivo de exemplo no diretório do frontend:
```bash
cp apps/frontend/.env.example apps/frontend/.env
```
O arquivo `apps/frontend/.env` deve conter a URL de conexão com a API:
```env
VITE_API_URL=http://localhost:3333
```

### Passo 2: Inicialização de Contêineres

Abra o terminal na raiz do monorepo (diretório que contém o arquivo `docker-compose.yml`) e execute o comando para construir e iniciar os serviços:
```bash
docker compose up --build
```

### Passo 3: Acesso à Aplicação

Aguarde a finalização da inicialização. Os serviços estarão em mapeamento nas portas:
* **Frontend Web:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:3333](http://localhost:3333)

### Passo 4: Encerramento

No terminal, ainda na raiz do monorepo, utilize o comando para parar a execução e remover os contêineres de processamento:
```bash
docker compose down
```

### Documentação e Monitoramento da API
Documentação (Swagger)
A API provê documentação sob o padrão OpenAPI 3.0. A interface apresenta o esquema de dados de requisição e de resposta de rotas e permite a execução de testes.

O agrupamento de endpoints ocorre nas categorias:

* **Indicators:** Registro, listagem e consulta de histórico de indicadores.

* **Favorites:** Gestão de indicadores de seleção do usuário.

* **Sync:** Execução manual de rotinas de integração de dados com o Banco Central do Brasil (BCB) e o Federal Reserve (FRED).

* **Health:** Verificação de status do servidor.


Para execução de chamadas, acesse a URL [http://localhost:3333/docs](http://localhost:3333/docs), expanda a rota em análise, preencha os parâmetros de entrada e acione a requisição.


---

## Decisões de Arquitetura

* **Agendador de Tarefas:** Uso de `node-cron` no arquivo `sync-scheduler.ts` com a expressão `0 0 * * *`. A execução ocorre uma vez por dia, à meia-noite, para evitar a repetição de requisições para as APIs do BCB e do FRED.
* **Provedores:** Centralização de identificadores de chamadas (`id`) no objeto `PROVIDER_CONFIG` na camada de infraestrutura do backend. O caso de uso e o agendador operam com os códigos do banco de dados.
* **Favoritos:** Armazenamento de indicadores por meio de tabela de relacionamento no PostgreSQL. A abordagem retém os dados entre sessões.

---

## Séries de Escolha e Referências

| Código de Sistema | Fonte | ID na API | Justificativa de Uso | URL de Referência |
| :--- | :--- | :--- | :--- | :--- |
| `USD_BRL` | BCB (SGS) | 1 | Acompanhamento de preço do dólar para transações de comércio. | [BCB Dados Abertos](https://dadosabertos.bcb.gov.br/) |
| `SELIC` | BCB (SGS) | 11 | Monitoramento de taxa de juros de mercado no Brasil. | [BCB SGS](https://www3.bcb.gov.br/sgspub/) |
| `IPCA` | BCB (SGS) | 433 | Medição de índice de inflação de consumo no Brasil. | [BCB SGS](https://www3.bcb.gov.br/sgspub/) |
| `SELIC_META` | BCB (SGS) | 432 | Meta de juros do Copom para controle de inflação. | [BCB SGS](https://www3.bcb.gov.br/sgspub/) |
| `FEDFUNDS` | FRED | FEDFUNDS | Monitoramento de taxa de juros entre bancos nos Estados Unidos. | [FRED Portal](https://fred.stlouisfed.org/) |
| `GDP` | FRED | GDP | Mensuração do PIB dos Estados Unidos. | [FRED Portal](https://fred.stlouisfed.org/) |

---

## Regras de Variação e Janela de Histórico

A fórmula de variação em exibição no painel e na tela de detalhes:

Variação = ((V2 - V1) / V1) * 100

* **Séries com Periodicidade de Dias (Câmbio e Selic):** Comparação do registro da data de referência com o registro de data de antes no banco de dados.
* **Séries com Periodicidade de Meses ou Trimestres (IPCA, GDP, FEDFUNDS):** Comparação do registro do período de referência com o registro de período de antes.
* **Tratamento de Lacunas:** Em finais de semana ou feriados, o sistema adota o valor em armazenamento no banco de dados. Fórmulas de interpolação não entram em aplicação.

---

## Execução de Scripts

Os comandos em sequência são para execução e validação de código fora do ambiente Docker.

### Backend API (Desenvolvimento)
```bash
cd apps/backend
npm install
npm run dev
```

### Frontend Web (Desenvolvimento)
```bash
cd apps/frontend
npm install
npm run dev
```

### Testes de Backend

> **Aviso:** A execução de testes de backend exige o banco de dados em operação. Mantenha os contêineres em execução com o comando `docker compose up` antes de rodar os scripts de teste. Ao executar o comando npm run test, o banco pulse_fx_test será criado em tempo real

Para executar a suíte de testes da API e do banco de dados:
```bash
cd apps/backend
npm install
npm run test
```

### Testes de Frontend

Para executar a suíte de testes de interface:
```bash
cd apps/frontend
npm install
npm run test
```

## Referências e Tecnologias

### Fontes de Dados
* **Banco Central do Brasil (SGS/Olinda):** [Portal de Dados Abertos](https://dadosabertos.bcb.gov.br/) e [Sistema Gerenciador de Séries Temporais](https://www3.bcb.gov.br/sgspub/).
* **Federal Reserve Economic Data (FRED):** [Portal FRED](https://fred.stlouisfed.org/).

### Backend e Infraestrutura
* **Node.js:** [Documentação](https://nodejs.org/).
* **Fastify:** [Documentação](https://fastify.dev/).
* **Winston:** [Documentação](https://github.com/winstonjs/winston).
* **node-pg-migrate:** [Documentação](https://salsita.github.io/node-pg-migrate/).
* **PostgreSQL:** [Documentação](https://www.postgresql.org/).
* **Docker:** [Documentação](https://docs.docker.com/).

### Frontend
* **React:** [Documentação](https://react.dev/).
* **Axios:** [Documentação](https://axios-http.com/).
* **React Router:** [Documentação](https://reactrouter.com/).

### Desenvolvimento e Testes
* **OpenAPI (Swagger):** [Documentação](https://swagger.io/specification/).
* **Jest:** [Documentação](https://jestjs.io/).
* **Vitest:** [Documentação](https://vitest.dev/).