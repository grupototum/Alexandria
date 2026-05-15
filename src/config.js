require('dotenv').config({ quiet: true });

const REQUIRED_ENV = [
  'GOOGLE_API_KEY',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'ALEXANDRIA_API_TOKEN'
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value === '<replace_me>') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    googleApiKey: requireEnv('GOOGLE_API_KEY'),
    supabaseUrl: requireEnv('SUPABASE_URL'),
    supabaseServiceKey: requireEnv('SUPABASE_SERVICE_KEY'),
    alexandriaApiToken: requireEnv('ALEXANDRIA_API_TOKEN'),
    embeddingTimeoutMs: Number(process.env.EMBEDDING_TIMEOUT_MS || 15000),
    maxBatchDocuments: Number(process.env.MAX_BATCH_DOCUMENTS || 25)
  };
}

function validateConfig() {
  const config = getConfig();
  if (!Number.isFinite(config.embeddingTimeoutMs) || config.embeddingTimeoutMs <= 0) {
    throw new Error('EMBEDDING_TIMEOUT_MS must be a positive number');
  }
  if (!Number.isInteger(config.maxBatchDocuments) || config.maxBatchDocuments <= 0) {
    throw new Error('MAX_BATCH_DOCUMENTS must be a positive integer');
  }
  return config;
}

module.exports = {
  REQUIRED_ENV,
  validateConfig
};
