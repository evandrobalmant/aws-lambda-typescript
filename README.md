# AWS Lambda

Modelo de projeto de Lambda com Serverless Framework e TypeScript.

As dependências necessárias para executar o projeto são:

- [Node.js](https://nodejs.org/en/)
- [Serverless Framework](https://serverless.com/)
- [Credenciais da conta AWS](https://www.youtube.com/watch?v=KngM5bfpttA)

## Como foi criado

```
$ serverless create --template aws-nodejs-typescript --path lambda-project
$ cd lambda-project
$ npm install
$ npm install --save aws-sdk
```

No arquivo ***serverless.yml*** são definidas as configurações do projeto. 

```
service:
  name: lambda-example

plugins:
  - serverless-webpack

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          method: get
          path: hello
```

- **service.name**: Nome da lambda quando o projeto for publicado
- **plugins**: Lista de [plugins do Serverless Framework](https://serverless.com/plugins/) usados no projeto
- **provider.name**: Provedor usado no projeto (AWS, Google, Azure, IBM, Cloudflare)
- **provider.runtime**: Ambiente de execução, atualmente a Amazon aceita Node.js, Python, Ruby, Java, Go e .NET
- **functions**: Definição das funções do projeto, pacote.método correspondente para execução e quais formas serão acessados


**Para testar a primeira execução:**

```
$ serverless invoke local --function hello
```

Nesse primeiro exemplo, conforme definido no serverless.yml, a única função do projeto é a **hello** e está disponível para acesso via **http** pelo método GET na url **/hello**. Mas para executar localmente usando http você precisa instalar o [plugin serverless-offline](https://www.npmjs.com/package/serverless-offline).

```
npm install --save-dev serverless-offline
```

Inclua o plugin no **serverless.yml**

```
***
plugins:
  - serverless-webpack
  - serverless-offline
***
```

Levante o servidor HTTP localmente com o comando

```
$ serverless offline
```

Acesse [http://localhost:3000/hello](http://localhost:3000/hello).

A resposta da requisição será um JSON conforme código definido em **handler.ts** no método **hello**.

Uma Lambda com execução via HTTP será publicada na Amazon como API Gateway.

## Múltiplas Lambdas no mesmo projeto

É possível definir mais de uma função em um mesmo projeto do Serverless, conforme exemplo abaixo:

**serverless.yml**

```
...
functions:
  hello:
    ...
  nuvem:
    handler: handler.nuvem
...
```

**handler.ts**

```
import { APIGatewayProxyHandler, Context, Handler } from 'aws-lambda';

...

export const nuvem: Handler = async (mensagem: String, context: Context) => {
    context.succeed('Mensagem da Nuvem: ' + mensagem);
}
```

**Executar função [enviando parâmetro](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/)**

```
$ serverless invoke local --function nuvem --data "Olá"
```

**Resposta**: ***"Mensagem da Nuvem: Olá"***

## Eventos

Uma lambda pode ser invocada a partir de [eventos em vários serviços da AWS](https://docs.aws.amazon.com/pt_br/lambda/latest/dg/lambda-services.html), como por exemplo:

- [Amazon S3 - Simple Storage Service](https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-s3.html)
- [Amazon SNS - Simple Notification Service](https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-sns.html)
- [Amazon SQS - Simple Queue Service](https://docs.aws.amazon.com/pt_br/lambda/latest/dg/with-sqs.html)

### Ouvir eventos do S3

Executar uma Lambda quando um novo arquivo for adicionado ao seu bucket.

**serverless.yml**

```
...
functions:
  novo-arquivo:
    handler: handler.novoArquivoJSON
    events:
      - s3:
          bucket: meu-bucket-nome-unico-no-mundo
          event: s3:ObjectCreated:*
          rules:
            - prefix: dados/
            - suffix: .json
...
```

**handler.ts**

```
...
export const novoArquivoJSON: Handler = async (event: APIGatewayProxyEvent, _context: Context) => {
  console.info(event);
}
...
```

O evento será acionado quando um arquivo .json for adicionado na pasta dados do bucket.

Faça deploy do projeto na infra da Amazon

```
$ sls deploy
```

Acompanhe pelo CloudWatch se as requisições estão chegando.

**Para simular eventos do S3 localmente** você precisa invocar a lambda passando o JSON do evento, e para criar um de exemplo use o [AWS SAM CLI](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

Gerar JSON com exemplo de evento put do S3

```
sam local generate-event s3 put
```

Gerar JSON com exemplo de evento put de um arquivo já existente do S3

```
sam local generate-event s3 put --bucket NOME-BUCKET --key CAMINHO-ARQUIVO
```

Executar a função com um JSON de evento local

```
serverless invoke local --function novo-arquivo --path src/s3Data.json
```


## Publicar o projeto

**Para publicar o projeto na AWS**

```
$ serverless deploy
```

Ou

```
$ sls deploy --stage dev
$ sls deploy --stage prod
```

**Para excluir o projeto da AWS**

```
$ serverless remove
```

Ou para remover um stage específico

```
$ sls remove --stage dev --region us-east-1
```
