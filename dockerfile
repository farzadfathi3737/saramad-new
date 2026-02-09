# Stage 1: Build
FROM node:20-bookworm AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm config set registry https://registry.npmjs.org/ && \
    rm -rf node_modules package-lock.json && \
    npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the Next.js app
CMD ["npm", "run", "start"]