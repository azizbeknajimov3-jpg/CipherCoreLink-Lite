# aios-core/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./ 
RUN npm install --production

COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]