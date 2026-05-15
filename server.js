const express = require('express');
const cors = require('cors');
const path = require('path');
const { validateConfig } = require('./src/config');

validateConfig();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  if (req.get('accept')?.includes('text/html')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  res.json({ status: 'ok', service: 'alexandria-api', ts: new Date().toISOString() });
});

const skillDiscovery = require('./src/skill-discovery');
app.use('/alexandria', skillDiscovery);

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Alexandria API rodando na porta ${PORT}`));
