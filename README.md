# eng-zap-challenge-javascript

Projeto de uma API backend, onde dada uma origem, retorna dados elegíveis para o Grupo ZAP ou Viva Real.

### Como rodar localmente?

1. Faça o clone deste projeto no seu computador.
2. Certifique-se de ter o npm instalado em sua máquina (comando: npm -v).
3. No diretório principal do projeto clonado em sua máquina, execute o comando para instalar as dependências do projeto:
   npm i
4. Garanta que o Node está instalado em sua máquina (comando node -v)
5. Execute o comando para iniciar o servidor localmente (irá utilizar a porta 3000):
   npm run start:dev
6. Após o servidor estar rodando, pode-se fazer requisições no endereço:
   http://localhost:3000/challenge/zap

### Informações importantes sobre a API:

- O parâmetro origin é obrigatório e tem somente dois valores válidos: zap ou vivareal.
- A API tem dois parâmetros opcionais que podem ser enviados via QueryString, que são pageNumber e pageSize. Estes parâmetros opcionais aceitam somente valores inteiros. Caso os valores opcionais não sejam informados, eles assumirão um valor default, sendo pageNumber igual a 1 e pageSize igual a 100.
- Exemplos de requisições feitas localmente:
  http://localhost:3000/challenge/zap
  http://localhost:3000/challenge/vivareal?pageNumber=1&pageSize=1

### Como rodar os testes?

Para executar os testes é necessário executar o comando:
npm run test

### Como fazer o deploy?

O deploy pode ser realizado de diversas formas. Por exemplo, algumas empresas utilizam pipelines onde são executadas várias etapas até chegar ao deploy da aplicação, essas etapas podem conter o building da aplicação, execução dos testes unitários e por fim o deploy da aplicação.

Neste desafio, foi realizado o deploy através do site de hospedagem Heroku que possui opções de planos gratuitos para hospedagem de aplicações. Para realizar o deploy foi necessário adicionar o arquivo Procfile no projeto e foram realizados alguns ajustes no arquivo package.json. A aplicação está disponível para ser acessada através do link:
https://eng-zap.herokuapp.com/challenge/vivareal

#END
