FROM node:16.17.0-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:1.23.3-alpine

COPY --from=builder /app/dist /app/dist

EXPOSE 3000




