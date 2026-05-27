FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
