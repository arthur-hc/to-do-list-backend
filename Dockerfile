# Multi-stage Dockerfile para desenvolvimento e produção

# ----------------- STAGE 1: Base -----------------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ----------------- STAGE 2: Development -----------------
FROM base AS development
# Instala TODAS as dependências (incluindo dev)
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ----------------- STAGE 3: Build -----------------
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ----------------- STAGE 4: Production -----------------
FROM base AS production
# Instala apenas dependências de produção
RUN npm install --omit=dev
# Copia apenas o build
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]