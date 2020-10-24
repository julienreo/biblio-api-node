FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "-r", "ts-node/register", "-r", "tsconfig-paths/register", "./dist/src/index.js"]

EXPOSE 3000
