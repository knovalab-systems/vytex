# Multi-stage

# 1) Node image for building frontend assets

FROM node:20.12.0-alpine AS builder

WORKDIR /build

COPY package*.json ./

RUN mkdir app

# for build client
RUN mkdir client

COPY client/package.json ./client

COPY app/package.json ./app

RUN npm install

COPY client ./client

RUN cd client && npm run build && cd ..

# for build app
COPY app ./app

RUN cd app && npm run build

# 2) nginx stage to serve frontend assets

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /build/app/dist .

# containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx","-g", "daemon off;"]