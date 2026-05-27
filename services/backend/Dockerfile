FROM oven/bun:latest

WORKDIR /app

# Copiar package.json
COPY package.json bun.lockb ./

# Instalar dependencias
RUN bun install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["bun", "start"]
