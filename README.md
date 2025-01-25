Here’s the updated `README.md` with the requested changes:

```markdown
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

A NestJS-based RESTful API for managing products in an e-commerce store. Includes features like CRUD operations, pagination, search, filtering, sorting, and JWT authentication for admin endpoints.

### Accessing Admin Endpoints
To access **admin-protected endpoints** (e.g., creating or deleting products):
1. **Log in via Swagger UI**:
   - Navigate to the Swagger documentation at `http://localhost:3000/api`.
   - Use the default credentials:
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Execute the `POST /auth/login` endpoint to receive a JWT token.
2. **Authorize Requests**:
   - Click the **Authorize** button in Swagger UI.
   - Enter the token in the format: `Bearer <your-token>`.

## Environment Setup

1. **Copy the `.env.example` file** to `.env`:
   ```bash
   cp .env.example .env
   ```
2. **Update the `.env` file** with your PostgreSQL database credentials and JWT secret:
   ```env
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   JWT_SECRET=your_jwt_secret_key
   ```

## Installation

```bash
$ npm install
```

## Running the App

```bash
# Development mode
$ npm run start

# Watch mode (auto-reload on changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

Run unit tests with:
```bash
$ npm run test
```

For detailed test coverage:
```bash
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in Touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
```