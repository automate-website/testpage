FROM node:argon

ENV NODE_PORT 80

WORKDIR /usr/var/app

COPY . /usr/var/app

VOLUME /usr/var/app/public

RUN npm install

EXPOSE ${NODE_PORT}

CMD [ "node", "--use_strict", "src/server.js" ]
