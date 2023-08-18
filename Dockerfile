# Base image
FROM node:16

# Create app directory
WORKDIR /app
ARG ENV
ENV ENV=$ENV
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /app

# Install app dependencies
RUN yarn install
# Bundle app source
COPY . /app
# Copy .env
COPY ".env_${ENV:-development}" /app/.env
# Creates a "dist" folder with the production build

RUN yarn run build
# Start the server using the production build
EXPOSE 80
CMD [ "node", "dist/main.js" ]