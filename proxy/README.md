# Projeto Gênesis - Servidor Proxy

Este diretório contém um servidor Node.js/Express que atua como um backend-proxy seguro para a aplicação "Projeto Gênesis".

## Função

O objetivo principal deste servidor é proteger sua chave da API Google Gemini. Em vez do frontend (a aplicação Angular) chamar a API Gemini diretamente e expor a chave no navegador, ele envia as requisições para este servidor. O servidor então adiciona a chave de API (que está armazenada de forma segura no ambiente do servidor) e encaminha a requisição para a API Gemini.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (geralmente vem com o Node.js)

## Setup e Instalação

1.  **Navegue até o diretório do proxy:**
    ```bash
    cd proxy
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    - Crie um arquivo chamado `.env` na raiz do diretório `proxy/`.
    - Adicione sua chave da API Google Gemini a este arquivo:
      ```
      API_KEY=SUA_CHAVE_DE_API_AQUI
      ```
    - Substitua `SUA_CHAVE_DE_API_AQUI` pela sua chave real.

## Executando o Servidor

Para iniciar o servidor proxy, execute o seguinte comando no diretório `proxy/`:

```bash
npm start
```

Você deverá ver a seguinte mensagem no seu terminal, indicando que o servidor está rodando:

```
Projeto Gênesis Proxy Server rodando em http://localhost:3000
```

Agora a aplicação frontend do "Projeto Gênesis" será capaz de se comunicar com este servidor para obter os planos e revisões de código da IA.

## Futuras Melhorias

- **Rate Limiting:** Para evitar abuso, uma camada de limitação de taxa (rate limiting) pode ser adicionada para restringir o número de requisições que um único cliente pode fazer em um determinado período de tempo.
- **Cache:** Requisições idênticas poderiam ser cacheadas (usando um sistema como Redis) para melhorar a performance e reduzir os custos da API.
