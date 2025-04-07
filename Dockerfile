# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables inside Dockerfile
ENV PORT=3001
ENV DATABASE_URL="postgresql://postgres:tdc12345@15.185.254.143:5432/movie-management-db-1?schema=public"
#JWT Keys
ENV JWT_SECRET="tdc1234"
ENV Salt_Or_Rounds=10
ENV JWT_EXPIRY_TIME=100000s

#Cloudinary Keys
ENV CLOUDINARY_CLOUD_NAME="dgbjpy7ev"
ENV CLOUDINARY_API_KEY=278248299317886
ENV CLOUDINARY_API_SECRET="SPNdGFXd24YKWqQF5aH6sWAS_ek"


# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]