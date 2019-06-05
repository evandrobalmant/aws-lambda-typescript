# AWS Lambda

Modelo de projeto de Lambda com Serverless Framework e TypeScript

As dependências necessárias para executar o projeto são:

- [Node.js](https://nodejs.org/en/)
- [Serverless Framework](https://serverless.com/)

## Como foi criado

```
$ serverless create --template aws-nodejs-typescript --path lambda-project
$ cd lambda-project
$ npm install
$ npm install --save aws-sdk
```

**Para testar a primeira execução execute:**

```
$ serverless invoke local --function hello
```



**Para publicar o projeto**

```
$ serverless deploy
```
