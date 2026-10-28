# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests first for build caching
COPY package.json package-lock.json ./

# Install all dependencies including devDependencies required for building
RUN npm ci

# Copy frontend source code
COPY . .

# Build-time API base URL (accessible by client browser)
ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build static production bundle
RUN npm run build

# Stage 2: Production runtime stage using lightweight Nginx
FROM nginx:alpine

# Copy custom Nginx configuration listening on port 5173 with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 5173

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
