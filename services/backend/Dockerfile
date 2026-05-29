FROM oven/bun:1.3

WORKDIR /app

# Copiar package.json y lock file
COPY package.json bun.lock ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["bun", "run", "dev"]
