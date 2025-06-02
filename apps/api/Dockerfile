FROM node:22-bullseye AS builder

ARG NODE_ENV
WORKDIR /app/builder
COPY . .
RUN npm i

RUN npx nx build api

FROM node:22-bullseye

WORKDIR /app
COPY --from=builder /app/builder ./

CMD ["node", "./apps/api/dist/main.js"]