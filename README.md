# Rate Limiter

## Overview

Simple Express.js server leveraging Redis to enforce rate limiting using a sliding window. Default configuration allows 100 requests per hour per unique IP.

## Technology Stack

- [Typescript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Redis](https://redis.io/)
- [express-validator](https://express-validator.github.io/docs/)

## Example

<video src="./media/2021_09_15_rate_limter_example.mov" alt="Weather email example" width="500px" />

## Setup

- Run `npm install` to install dependencies
- Run `docker-compose up` to start the Express.js server and Redis node

For any other commands, run `npm run ntl` to see choices available.

*Note, if the Express.js server is built and run without docker-compose ensure the `REDIS_CONNECTION_STRING` environment variable is provided.*

