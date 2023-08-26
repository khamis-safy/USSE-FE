# ----------------------------
# build from source
# ----------------------------
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:alpine
COPY --from=node /app/dist/demo-app /usr/share/nginx/html