# Repositório

Projeto feito baseado no seguinte [repositório](https://github.com/rodrigobotti/rs-ws-2020-env), com o objetivo de trabalhar com ambiente de desenvolvimento utilizando containers.

## Rodando a aplicação

Para rodar a aplicação, basta ter o Docker instalado e rodar o comando: 

````
  docker-compose up
````

Feito isso, a aplicação poderá ser acessada em [localhost:3000](http://localhost:3000).

## Endpoints disponíveis

  - GET /api/tv-shows: 
    * Lista as 5 séries de TV com mais likes
  - GET /api/tv-shows/top-rated
    * Lista as séries de TV com maior avaliação
  - POST /api/tv-shows
    * Adiciona uma nova série de TV
  - PUT /api/tv-shows/:id/likes
    * Adiciona um like na série de TV