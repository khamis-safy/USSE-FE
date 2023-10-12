FROM node:14 as builder

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.19

COPY --from=builder /app/dist/pro2023 /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf