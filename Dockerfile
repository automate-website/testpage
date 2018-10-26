FROM node:argon

ENV NODE_PORT 3000

WORKDIR /usr/var/app

COPY . /usr/var/app

VOLUME /usr/var/app/public

RUN npm install

EXPOSE 3000

CMD [ "node", "--use_strict", "src/server.js" ]
