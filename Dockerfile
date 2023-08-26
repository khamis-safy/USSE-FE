# ----------------------------
# build from source
# ----------------------------
FROM node:18 AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build --prod

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:alpine
COPY --from=node /app/dist/demo-app /usr/share/nginx/html