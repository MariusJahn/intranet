#FROM nginx:1.19.6
#COPY dist/intranet-feuerwehr /usr/share/nginx/html

### Stage 1: Build ###
FROM node:15.7.0-alpine3.10 AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build --prod

### Stage 2: Run ###
FROM nginx:1.19.6-alpine AS prod-stage
COPY --from=build /app/dist/intranet-feuerwehr /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx","-g","daemon off"]
