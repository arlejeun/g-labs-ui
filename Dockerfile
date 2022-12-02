#Build step 1
FROM node:18.2.0-alpine3.15 as builder

RUN mkdir -p /usr/src/app
RUN chown -R node:node /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# update the NodeJS container with the latest and greatest at build time
RUN apk update && apk upgrade
RUN apk add git

#copy the package.json file over

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node . /usr/src/app

#Switch user to node
USER node

#Install NPM packages
RUN npm install && npm cache clean --force

RUN npm run build

#Build step 2
FROM httpd:2.4.53-alpine

COPY --from=builder /usr/src/app/dist/. /usr/local/apache2/htdocs/

# If you are building your code for production
# RUN npm ci --only=production
