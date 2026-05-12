const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'alexandria-api', ts: new Date().toISOString() }));

const skillDiscovery = require('./src/skill-discovery');
app.use('/alexandria', skillDiscovery);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Alexandria API rodando na porta ${PORT}`));
