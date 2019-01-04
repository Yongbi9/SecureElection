#Download base image
FROM node:8
 
# Update Software repository
RUN apt-get update

# Create app directory
WORKDIR /app_client

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app_client

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . /app_client

EXPOSE 80
CMD [ "npm", "start" ]
