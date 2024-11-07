/*
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Habilita o CORS para todas as origens
app.use(cors());

// Rota básica para teste
app.get('/', (req, res) => {
  res.send('Servidor proxy SSE funcionando!');
});

// Rota principal para proxy do SSE
app.get('/sse-proxy', async (req, res) => {
  const salesforceUrl = 'https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/eventrouter/v1/sse';
  const authToken = req.headers.authorization;
  const orgId = req.headers['x-org-id'];

  if (!authToken || !orgId) {
    return res.status(400).json({ 
      error: 'Authorization token e X-Org-Id são obrigatórios',
      receivedHeaders: {
        authorization: authToken ? 'presente' : 'ausente',
        'x-org-id': orgId ? 'presente' : 'ausente'
      }
    });
  }

  try {
    // Configurar headers para SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Log para debug
    console.log('Iniciando conexão com Salesforce...');
    console.log('Headers:', {
      Authorization: authToken.substring(0, 20) + '...',
      'X-Org-Id': orgId
    });

    // Fazer requisição para o Salesforce
    const response = await fetch(salesforceUrl, {
      headers: {
        'Authorization': authToken,
        'X-Org-Id': orgId,
        //'Accept': ''
      }
    });

    // Verificar se a resposta é ok
    if (!response.ok) {
      console.error('Erro Salesforce:', response.status, response.statusText);
      throw new Error(`Salesforce respondeu com status: ${response.status}`);
    }

    console.log('Conexão estabelecida com sucesso');

    // Enviar heartbeat a cada 30 segundos para manter a conexão viva
    const heartbeat = setInterval(() => {
      res.write(':\n\n');
    }, 30000);

    // Encaminhar os eventos do Salesforce para o cliente
    response.body.on('data', (chunk) => {
      console.log('Recebido evento:', chunk.toString());
      res.write(chunk);
    });

    response.body.on('error', (error) => {
      console.error('Erro no stream:', error);
      clearInterval(heartbeat);
      res.end();
    });

    // Quando o cliente desconectar
    req.on('close', () => {
      console.log('Cliente desconectou');
      clearInterval(heartbeat);
      response.body.destroy();
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao conectar com Salesforce',
      details: error.message 
    });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

*/


const express = require('express');
const cors = require('cors');
const app = express();

// Habilita CORS para todas as origens
app.use(cors());

// Configuração para SSE (Server-Sent Events)
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas as origens

    // Envia uma mensagem a cada 3 segundos
    setInterval(() => {
        res.write('data: { "message": "Ping" }\n\n');
    }, 3000);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


