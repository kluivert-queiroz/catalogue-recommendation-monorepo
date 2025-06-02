# Dockerfile
FROM node:22-bullseye

# Create app directory
WORKDIR /app

COPY . .

# Install dependencies with npm
RUN npm install

# Expose the port the NestJS app will use
EXPOSE 3000

# TODO multi-stage building and use production ready
CMD ["npx", "nx", "serve", "api", "--host=0.0.0.0","--configuration=production"]