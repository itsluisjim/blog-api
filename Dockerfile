# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /usr/src/app

# Copy the app package and package-lock.json file
COPY package.json ./
# Copy local directories to the current local directory of our docker image (/app)

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install 

COPY . .

EXPOSE 3000

# Start the app using serve command
CMD ["npm", "run", "start"]