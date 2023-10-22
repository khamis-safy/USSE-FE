# ----------------------------
# build from source
# ----------------------------
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm --verbose install
RUN npm run build

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:alpine
COPY --from=node /app/dist/pro2023 /usr/share/nginx/html

