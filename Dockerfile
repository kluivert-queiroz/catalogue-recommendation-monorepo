# Dockerfile.dev
FROM node:22-bullseye

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create app directory
WORKDIR /app

# Copy only lock and package files first for better caching
COPY . .

# Install dependencies with pnpm
RUN pnpm install

# Expose the port the NestJS app will use
EXPOSE 3000

# Serve the app in dev mode
CMD ["pnpm", "nx", "serve", "api", "--host=0.0.0.0"]