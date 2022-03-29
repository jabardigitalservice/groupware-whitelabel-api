FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build
RUN npm prune --production

FROM softonic/node-prune:latest AS pruner
COPY --from=builder /app/node_modules /app/node_modules
RUN node-prune /app/node_modules

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=pruner /app/node_modules ./node_modules
EXPOSE 3000
CMD node dist/main.js