# Rate Limiter

## Overview

Simple Express.js server leveraging Redis to enforce rate limiting using a sliding window. Default configuration allows 100 requests per hour per unique IP.

## Technology Stack

- [Typescript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/)
- [express-validator](https://express-validator.github.io/docs/)

## Example

For demonstration purposes, the below example allows only 3 requests per minute per unique IP.

https://user-images.githubusercontent.com/13091519/133372384-2f421b29-cc74-4182-b403-4e72a6ac4bc0.mov

## Setup

- Run `npm install` to install dependencies
- Run `docker-compose up` to start the Express.js server and Redis node

For any other commands, run `npm run ntl` to see choices available.

*Note, if the Express.js server is built and run without docker-compose ensure the `REDIS_CONNECTION_STRING` environment variable is provided.*

