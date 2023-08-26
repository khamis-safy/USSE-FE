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
COPY --from=node /app/dist/pro2023 /usr/share/nginx/html
# Move the default conf out of the way
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf_orig 
# Copy in your project's new nginx conf
COPY --from=node /app/nginx.conf /etc/nginx/
