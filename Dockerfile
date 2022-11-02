FROM node:16-alpine as base

WORKDIR /app
COPY package*.json /
EXPOSE 8080

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "index.js"]