FROM node:20.10.0-buster-slim

WORKDIR /app

COPY package.json ./

RUN npm config set registry http://registry.npmjs.org/
RUN npm install -f
RUN npm run generate

COPY . .

EXPOSE 3000

CMD npm run dev