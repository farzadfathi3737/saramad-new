# # Stage 1: Build
# FROM node:22.14.0 AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Clean install dependencies
# # RUN npm config set registry https://registry.npmjs.org/ && \
# RUN npm config set registry https://nexus.kartio.ir/repository/npm-proxy/ 
# #     rm -rf node_modules package-lock.json && \
# #     npm install
# #run npm install @next/swc-linux-x64-gnu --registry=https://nexus.kartio.ir/repository/npm-group/

# # Copy source code
# COPY . .

# ENV NEXT_DISABLE_SWC_BINARY_DOWNLOAD=1
# ENV NEXT_FORCE_SWCPP=1

# # Build the Next.js app
# RUN npm run build

# # Stage 2: Production
# FROM node:22.14.0 AS runner

# WORKDIR /app

# # Copy built files from builder
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public

# # Expose the port
# EXPOSE 3000

# # Set production environment
# ENV NODE_ENV=production

# # Start the Next.js app
# CMD ["npm", "run", "start"]





# # Stage 1: Build
# FROM node:20.10.0 AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --omit=dev --ignore-scripts
# COPY . .
# RUN npm run build

# # Stage 2: Runtime
# FROM node:20.10.0 AS runner
# WORKDIR /app

# # فقط فایل‌های لازم رو کپی کن
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package*.json ./

# RUN npm install --omit=dev --ignore-scripts

# EXPOSE 3000
# CMD ["npm", "run", "start"]








#Use an official Node.js runtime as a parent image
#FROM node:20.10.0
FROM node:22.14.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
#COPY package*.json ./

# Install dependencies
RUN npm install 

# RUN npm config set registry https://nexus.kartio.ir/repository/npm-proxy/ && \
# rm -rf package-lock.json && \
# npm install

# Copy the rest of the application code
COPY . .

#COPY .env /app/.env

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]