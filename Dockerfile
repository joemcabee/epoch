FROM node:lts-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install all dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Install a lightweight server to serve the built files
RUN npm install -g serve

# Expose the port
EXPOSE 5173

# Change ownership of the application files
RUN chown -R node /usr/src/app

# Switch to the node user
USER node

# Start the production server
CMD ["serve", "-s", "dist", "-l", "5173", "-n"]