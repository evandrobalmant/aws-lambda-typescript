import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }),
    };
}

export const nuvem: Handler = async (mensagem: String, context: Context) => {
    context.succeed('Mensagem da Nuvem: ' + mensagem);
}

export const novoArquivoJSON: Handler = async (event: APIGatewayProxyEvent, _context: Context) => {
  console.info(event);
}