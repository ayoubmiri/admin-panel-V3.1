FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Optional: Fix react-scripts permission issue
RUN chmod +x node_modules/.bin/react-scripts

# Build the app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the React build folder
CMD ["serve", "-s", "build", "-l", "3000"]















# # # # # Use an official Node.js image
# # # # FROM node:18

# # # # # Set working directory
# # # # WORKDIR /app

# # # # # Copy package.json and install dependencies
# # # # COPY package.json ./
# # # # COPY package-lock.json ./
# # # # RUN npm install

# # # # # Copy the rest of your app
# # # # COPY . ./

# # # # # Start the React dev server
# # # # CMD ["npm", "start"]


# # # FROM node:20

# # # WORKDIR /app

# # # COPY package.json package-lock.json ./
# # # RUN npm install

# # # COPY . .

# # # CMD ["npm", "start"]




# # FROM node:20 AS build
# # WORKDIR /app
# # COPY package.json package-lock.json ./
# # RUN npm install
# # COPY . .
# # RUN npm run build

# # FROM node:20
# # WORKDIR /app
# # RUN npm install -g serve
# # COPY --from=build /app/build /app/build
# # CMD ["serve", "-s", "build", "-l", "3000"]



# FROM node:20

# WORKDIR /app

# # Copy package files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Ensure node_modules binaries are executable
# RUN chmod -R +x /app/node_modules/.bin

# # Copy the rest of the application
# COPY . .

# # Build the production bundle
# RUN npm run build

# # Install a static server for production
# RUN npm install -g serve

# # Run as node user, serve the build on port 3000
# USER node
# CMD ["serve", "-s", "build", "-l", "3000"]