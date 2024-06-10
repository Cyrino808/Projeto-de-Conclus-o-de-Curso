Projeto de Gestão de Dados Públicos
Este projeto utiliza várias tecnologias e bibliotecas para coletar, processar e exibir dados relacionados a diversos aspectos da administração pública no Brasil.

Funcionalidades
Coleta de dados do Bolsa Família: Realiza chamadas à API do Portal da Transparência para obter dados sobre pagamentos do Bolsa Família por município.
Análise de despesas de deputados: Extrai informações sobre gastos parlamentares a partir da API da Câmara dos Deputados.
Processamento de dados em planilhas: Utiliza a biblioteca XLSX para manipulação de arquivos Excel.
Raspagem de dados: Coleta informações de sites utilizando as bibliotecas cheerio e axios.
Processamento de OCR: Funções de OCR para reconhecimento óptico de caracteres em imagens.
Visualização e renderização: Utiliza express e ejs para servir páginas web dinâmicas.

Requisitos
Node.js
NPM (Node Package Manager)

Instalação

Clone o repositório
Instale as dependências

Uso

Inicie o servidor:
npm start

O servidor estará rodando na porta 8000. Você pode acessar a aplicação através do endereço:
http://localhost:8000

Estrutura do Projeto

index.js: Arquivo principal que configura e inicia o servidor Express, define rotas e manipula a lógica principal da aplicação.
arquivos/: Diretório para arquivos auxiliares.
tabelas/: Diretório para tabelas de dados publicos. 
views/: Diretório para templates EJS.
ocr.cjs: Módulo para funções de OCR.
orçamento_campinas.cjs: Módulo para funções específicas relacionadas ao orçamento de Campinas.

Dependências Principais
express: Framework web para Node.js.

ejs: Motor de templates para gerar HTML.

path: Módulo para manipulação de caminhos de arquivos.
http e https: Módulos para criação de servidores HTTP e HTTPS.
XLSX: Biblioteca para manipulação de arquivos Excel.
better-queue: Biblioteca para gerenciamento de filas de tarefas.
node-fetch: Biblioteca para fazer requisições HTTP.
cheerio: Biblioteca para manipulação e raspagem de HTML.
axios: Biblioteca para fazer requisições HTTP.
fs: Módulo para manipulação do sistema de arquivos.

Dados Utilizados
Listas de Vereadores
Contém informações sobre os vereadores de Campinas.
Estados por Região
Contém mapeamento de estados brasileiros por região.
Lista de Aeroportos
Contém informações sobre aeroportos brasileiros, incluindo código, nome e estado.
Cota Parlamentar
Contém informações sobre os valores da cota parlamentar por estado.

Contato
Para mais informações, entre em contato pelo email: vinicius.cyrino1@gmail.com
