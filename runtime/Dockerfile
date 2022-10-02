FROM node:18-alpine AS builder
WORKDIR /temp

COPY package.json package.json
COPY yarn.lock yarn.lock

ENV NODE_ENV=development
RUN ["yarn", "install", "--frozen-lockfile", "--ignore-engines"]

COPY . .
ENV NODE_ENV=production
RUN ["yarn", "build"]

# Production stage, thinner image with only what we need
FROM node:18 AS production
WORKDIR /srv

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -qy tini libc++1 && apt-get clean

COPY --from=builder /temp/package.json package.json
COPY --from=builder /temp/workers workers
COPY --from=builder /temp/dist dist

RUN ["yarn", "install", "--frozen-lockfile", "--production", "--ignore-engines"]

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=2 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/_/health || exit 1

#USER node

ENTRYPOINT [ "yarn", "start" ]