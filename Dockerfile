FROM node:alpine

# Creates the directory for the api
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package.json /usr/src/api
RUN npm install

COPY src /usr/src/api/src

# Start the bot
CMD ["node", "src/index.js"]