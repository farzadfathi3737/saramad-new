# Use an official Node.js runtime as a parent image
#FROM node:20.10.0
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

COPY .env /app/.env

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]


# # Stage 1: Build
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --omit=dev --ignore-scripts
# COPY . .
# RUN npm run build

# # Stage 2: Runtime
# FROM node:20-alpine AS runner
# WORKDIR /app

# # فقط فایل‌های لازم رو کپی کن
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package*.json ./

# RUN npm install --omit=dev --ignore-scripts

# EXPOSE 3000
# CMD ["npm", "run", "start"]
