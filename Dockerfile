FROM node:20-alpine

WORKDIR /app

# Instala dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm install

# Copia o resto do projeto
COPY . .

# Expõe a porta do Vite
EXPOSE 7777

# Roda o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
