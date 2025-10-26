# Use an official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose the port your provider runs on (e.g. 4000)
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]
