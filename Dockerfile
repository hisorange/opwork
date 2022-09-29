FROM node:18

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -qy tini libc++1 && apt-get clean

WORKDIR /srv
RUN npm install workerd
COPY opwork.capnp hello.js ./

CMD ["npx", "workerd", "serve", "opwork.capnp"]