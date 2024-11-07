
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


