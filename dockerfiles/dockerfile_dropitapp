FROM node:8-alpine

# env var from compose
ARG PORT
ARG MONGO_USERNAME
ARG MONGO_PASSWORD
ARG MONGO_DATABASE
ARG DB_HOST
ARG NODE_ENV=development

# set passed data as env variables
ENV PORT ${PORT}
ENV DATABASEURL mongodb://$MONGO_USERNAME:$MONGO_PASSWORD@$DB_HOST/$MONGO_DATABASE
ENV NODE_ENV ${NODE_ENV}

# create required directory structure, add user & set permissions
RUN mkdir -p /var/app /var/app/files \
			&& addgroup -S dropitapp \
			&& adduser -D -S dropitapp -G dropitapp

# set working directory to app folder
WORKDIR /var/app

# copy app contents
COPY package.json /var/app

# install packages and remove cache
RUN npm install && npm cache clean -f

# copy rest of the files
ADD . /var/app

# give permission
RUN chown -R dropitapp:dropitapp /var/app && chmod g+rw /var/app && chmod g-x /var/app/files

# switch user
USER dropitapp

# boot app
CMD npm run start