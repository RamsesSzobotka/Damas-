FROM oven/bun:1.3

WORKDIR /app

# Copiar package.json y bun.lock
COPY package.json bun.lock ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build
RUN bun run build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar
CMD ["bun", "run", "dev", "--", "--host"]
