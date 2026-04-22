# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build args are baked into the static bundle at build time.
# ARG values must be promoted to ENV so the Vite process can read them.
ARG VITE_SF_BASE_URL=https://mock.flashydrinks.com
ARG VITE_SF_CLIENT_ID=mock_client_id
ARG VITE_SF_WEBSTORE_ID=webstore_001
ARG VITE_USE_MOCKS=true

ENV VITE_SF_BASE_URL=$VITE_SF_BASE_URL
ENV VITE_SF_CLIENT_ID=$VITE_SF_CLIENT_ID
ENV VITE_SF_WEBSTORE_ID=$VITE_SF_WEBSTORE_ID
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS

RUN npm run build

# Serve stage — nginx serves the static files, no Node runtime needed
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing: unknown paths fall back to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
