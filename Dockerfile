# ----------------------------
# build from source
# ----------------------------
FROM node:18-alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration=development

# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:alpine
COPY --from=node /app/dist/pro2023 /usr/share/nginx/html

