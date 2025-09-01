# --- Stage 1: Build the React application ---
# Use a recent LTS version of Node.js for better compatibility and security.
FROM node:18-alpine AS build

# Set the working directory inside the container.
WORKDIR /app

# Copy only the package.json and package-lock.json files first.
# This leverages Docker's layer caching, so dependencies are only reinstalled if these files change.
COPY package.json ./

# Install dependencies. The --silent flag reduces log output.
# You can remove it to see more details if npm install is failing.
RUN npm install --silent

# Copy the rest of your application code.
COPY . .

# Use a build argument to get the environment variable from docker-compose
ARG VITE_API_BASE_URL

# Set the environment variable for the build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Run the build command. The issue is likely here.
# The `npm run build` command will fail with exit code 1 if there are any errors in your application code.
RUN npm run build

# --- Stage 2: Serve the static files with Nginx ---
FROM nginx:alpine

# Copy the build artifacts from the previous stage to the Nginx public directory.
# The default output directory for a `create-react-app` build is 'build', not 'dist'.
# If you are using a different framework like Vite, 'dist' is correct.
# This assumes the build output is a directory named 'dist' inside the /app directory.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80, which is the default for Nginx.
EXPOSE 80

# Start Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
