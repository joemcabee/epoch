FROM node:lts-alpine

# Set environment to development to install all dependencies
ENV NODE_ENV=development

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install all dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

# Expose the port Vite runs on
EXPOSE 5173

# Change ownership of the application files
RUN chown -R node /usr/src/app

# Switch to the node user
USER node

# Start the development server
CMD ["npm", "run", "dev"]