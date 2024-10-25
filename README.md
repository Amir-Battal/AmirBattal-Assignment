<div align="center">
  <h1># AmirBattal-Assignment</h1>
  The task involves creating a task management system with features like user authentication, task assignment, and database integration, while ensuring security, testing.
</div>
<h1 align="center">
  <br>
    <img src="https://cdn.worldvectorlogo.com/logos/typescript.svg" alt="TypeScript" width="200">
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</h1>

<p align="center">
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
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


<div align="center">

  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
</div>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#run-locally">Run Locally</a> •
  <a href="#run-test">Run tests</a> •
  <a href="#migration">Migration</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

* Task Management:
  - The project is a task manager where there are two main sections in the project:
      - User Section (There are two Roles: Admin, and User):
        - You can do the following: SignUp, SignIn, GetProfile, CRUD, Each user can link to more than one task.
      - Task Section:
        - You can do the following: CRUD, Each task can be associated with many users.


## API Reference

#### User API's
#### Auth Section
#### New User Sign Up 

```http
  POST /auth/signup
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name, email, password` | `object` | Public route for Create New User |

#### User Sign In

```http
  POST /auth/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email, password` | `object` | Public route for User Login |

#### Get User Profile

```http
  GET /auth/profile
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |

#### CRUD Section with C :)
#### Get All Users + Pagination

```http
  GET /user
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Params | Type     | Description                |
| `page` | `number` | Page Number |
| `limit` | `number` | Element Number |

#### Get User By Id

```http
  GET /user/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted User Id |

#### Update User

```http
  PATCH /user/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted User Id |
| Body | Type     | Description                |
| `name, email, password` | `object` | New User Data |

#### Delete User

```http
  DELETE /user/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted User Id |

#### Make Admin User

```http
  POST /user/:id/make-admin
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken should be Admin |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted User Id to be Admin |


#### Task API's CRUD
#### Create Task 

```http
  POST /task
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Body | Type     | Description                |
| `title, description, status, assignedTo` | `object` | Public route for Create New Task |

#### Get All Tasks + Pagination

```http
  GET /task?page=...&limit=...
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Params | Type     | Description                |
| `page` | `number` | Page Number |
| `limit` | `number` | Element Number |

#### Get User By Id

```http
  GET /task/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted Task Id |

#### Update Task

```http
  PATCH /task/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted Task Id |
| Body | Type     | Description                |
| `title, description, status, assignedTo` | `object` | New Task Data |

#### Delete Task

```http
  DELETE /task/:id
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted Task Id |

#### Mark As Complete

```http
  POST /task/:id/complete
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Parameter | Type     | Description                |
| `id` | `string` | Wanted Task Id |

#### Assigned Task To Users

```http
  POST /task/assign
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |
| Body | Type     | Description                |
| `taskId, to` | `object` | TaskId and UserId |

#### Get Completed Tasks + Pagination

```http
  GET /task/completed
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |

#### Get Pending Tasks + Pagination

```http
  GET /task/pending
```

| Authorization | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `accessToken` | `string` | **Required**. User accessToken |



<br />

## Run Locally

Clone the project

```bash
  git clone https://github.com/Amir-Battal/AmirBattal-Assignment.git
```

Go to project directory

```bash
  cd amirbattal-assignment
```

Install dependencies

```bash
$ npm install
```

To run this project, you will need to add the following environment variables to your .env file
Database Variables PostgresSQL
`DB_TYPE`
`DB_HOST`
`DB_PORT`
`DB_DATABASE`
`DB_USERNAME`
`DB_PASSWORD`

JWT Variable
`JWT_SECRET`

Bcrypt Hashing Variable
`SALT_OR_ROUNDS`

Example
```bash
# Database PostgresSQL
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=task-management
DB_USERNAME=username
DB_PASSWORD=password

# JWT 
JWT_SECRET=secret

# Bcrypt
SALT_OR_ROUNDS=10
```

Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

## Migration

```bash
# run
npm run migration:run

# generate
npm run migration:generate

# create
npm run migration:create --name=...

# revert
npm run migration:revert
```

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org/)
- [NestJs](https://nestjs.com/)
- [PostgresSQL](https://www.postgresql.org/)
- [Winston](https://www.npmjs.com/package/winston/v/2.4.6)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [class-validator](https://www.npmjs.com/package/class-validator)
- [class-transformer](https://www.npmjs.com/package/class-transformer)
- [TypeORM](https://docs.nestjs.com/recipes/sql-typeorm)
- [JsonWebToken](https://jwt.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Jest](https://jestjs.io/)
- [SuperTest](https://www.npmjs.com/package/supertest)

## License

ABGA Software and Systems [ABGA](https://abga.tech/)

---

> Linkedin [Amir Battal](https://www.linkedin.com/in/amir-battal/) &nbsp;&middot;&nbsp;
> GitHub [@Amir-Battal](https://github.com/Amir-Battal) &nbsp;&middot;&nbsp;

