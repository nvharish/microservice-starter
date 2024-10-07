# Use an official Node.js runtime as a parent image
FROM alpine:3.20.3

# Install Node.js and npm from Alpine's package manager
RUN apk add --no-cache nodejs npm

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json first to leverage Docker cache
COPY package*.json ./

# Install npm dependencies
RUN npm ci --omit=dev

# Copy your application files
COPY . .

# Create and use a non-root user to run the app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port 3000 (default port for Node.js development server)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]