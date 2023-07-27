FROM nginx:1.23-alpine

WORKDIR /app

COPY package.json .

# hadolint ignore=DL3016,DL3018,DL3019
RUN apk add --update nodejs npm \
    && npm install 

COPY . .

RUN npm run build

COPY nginx.conf /etc/nginx/conf.d/default.conf