FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:16-alpine AS server
WORKDIR /app
COPY --from=builder ./app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]