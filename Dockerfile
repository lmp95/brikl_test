FROM node:14

WORKDIR /backend

COPY package.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

CMD npm run dev