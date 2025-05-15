# Dockerfile.dev
FROM node:22-bullseye

# Create app directory
WORKDIR /app

# Copy only lock and package files first for better caching
COPY . .

# Install dependencies with pnpm
RUN npm install

# Expose the port the NestJS app will use
EXPOSE 3000

# Serve the app in dev mode
# TODO multi-stage building and use production ready
CMD ["npx", "nx", "serve", "api", "--host=0.0.0.0","--configuration=production"]