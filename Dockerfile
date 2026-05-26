# Dockerfile - Alexandria Totum OS
FROM node:20-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Argumentos de build para variáveis de ambiente públicas do frontend.
# Não definir valores reais aqui. Use docker-compose/.env ou secrets do ambiente.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copiar package.json
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci
RUN cd api && npm ci

# Copiar código da aplicação
COPY . .

# Build do frontend (com variáveis de ambiente fornecidas no build)
RUN npm run build

# Expor porta
EXPOSE 3002
ENV PORT=3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/api/health || exit 1

# Comando de start
CMD ["node", "api/server.js"]
