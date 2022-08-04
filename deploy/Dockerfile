FROM node:16.16.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx jake

FROM nginx
EXPOSE 9000

COPY --from=build-stage /app/build /app
COPY deploy/nginx.conf /etc/nginx/nginx.conf
