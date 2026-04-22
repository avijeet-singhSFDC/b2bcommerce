# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build args are baked into the static bundle at build time
ARG VITE_SF_BASE_URL
ARG VITE_SF_CLIENT_ID
ARG VITE_SF_WEBSTORE_ID
ARG VITE_USE_MOCKS=false

RUN npm run build

# Serve stage — nginx serves the static files, no Node runtime needed
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing: unknown paths fall back to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
