FROM node:alpine

#set port
ENV PORT 4000
ENV REDIS_CONNECTION_STRING redis://db-redis:6379

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]