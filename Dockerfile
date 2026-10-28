# Stage 1: Runtime environment for Task Manager API
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code and entry points
COPY server.js ./
COPY src/ ./src/

# Expose backend API port
EXPOSE 5000

# Start backend application
CMD ["npm", "start"]
