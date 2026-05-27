FROM oven/bun:1.3

WORKDIR /app

# Copiar package.json
COPY package.json bun.lockb ./

# Instalar dependencias
RUN bun install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3002

# Comando para iniciar
CMD ["bun", "start"]
