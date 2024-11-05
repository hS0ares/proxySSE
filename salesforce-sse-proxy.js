// package.json
{
  "name": "salesforce-sse-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.1",
    "dotenv": "^16.0.3"
  }
}

// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Configuração do CORS
app.use(cors({
  origin: '*', // Em produção, especifique os domínios permitidos
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Rota principal para proxy do SSE
app.get('/sse-proxy', async (req, res) => {
  const salesforceUrl = 'https://valtech-26e-dev-ed.develop.my.salesforce-scrt.com/eventrouter/v1/sse';
  const authToken = req.headers.authorization;
  const orgId = req.headers['x-org-id'];

  if (!authToken || !orgId) {
    return res.status(400).json({ error: 'Authorization token and X-Org-Id são obrigatórios' });
  }

  try {
    // Configurar headers para SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Fazer requisição para o Salesforce
    const response = await fetch(salesforceUrl, {
      headers: {
        'Authorization': authToken,
        'X-Org-Id': orgId,
        'Accept': '*/*'
      }
    });

    // Verificar se a resposta é ok
    if (!response.ok) {
      throw new Error(`Salesforce respondeu com status: ${response.status}`);
    }

    // Encaminhar os eventos do Salesforce para o cliente
    response.body.on('data', (chunk) => {
      res.write(chunk);
    });

    response.body.on('error', (error) => {
      console.error('Erro no stream:', error);
      res.end();
    });

    // Quando o cliente desconectar
    req.on('close', () => {
      response.body.destroy();
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao conectar com Salesforce' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});