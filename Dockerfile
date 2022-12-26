FROM node:18-alpine

WORKDIR /home/dl_app
COPY package.json .
RUN npm install
COPY . .
CMD npm run dev
