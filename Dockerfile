FROM node:12-slim

RUN apt-get update && apt-get install -y \
    curl

WORKDIR /starter
ENV NODE_ENV development

COPY package.json /starter/package.json



COPY .env.example /starter/.env.example
COPY . /starter

RUN npm install
RUN npm run copy-static-assets

CMD ["npm","start"]

EXPOSE 8080