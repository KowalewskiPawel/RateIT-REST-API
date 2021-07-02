# RateIT REST API

Backend for the RateIT project - interactive platform for sharing cars and motorcycles reviews.

### Installation

1. After cloning the repository install dependencies with the command `npm install` / `yarn install`
2. Create `.env` file in the main directory
3. Create MongoDB cluster and database.
4. Add your database address to the .env file as `MONGO_URI=<yourDBaddress>`
5. Add SendInBlue API key to the .env file as `SI_APIKEY=<yourSendInBlueAPIaddress>`
6. Add SendInBlue email address to the .env file as `SI_EMAIL=<yourSendInBlueEmailAddress`
7. Add JWT secret key (it's up to your personal choice) to the .env file as `JWT_SECRET=<yourJWTsecretKey>`
8. Type in `node app` to run the server
9. Additionally, you may use command `npm test` for testing issues, but you will also have to add additional values to the .env file

## Routes

This API currently uses 3 main routes, for managing users, cars and motorbikes.

### Users

- Signup

| Name     | Signup           |
| ------------- |:-------------:|
| endpoint      | `<host>/users/signup` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "email": "email",
    "password": "password",
    "confirmPassword": "password"
}`

- Login

| Name     | Login           |
| ------------- |:-------------:|
| endpoint      | `<host>/users/login` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "email": "email",
    "password": "password",
}`

- Activate

| Name     | Activate          |
| ------------- |:-------------:|
| endpoint      | `<host>/users/activate` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "email": "email",
    "code": "code",
}`

- Forgot Password

| Name     | Forgot           |
| ------------- |:-------------:|
| endpoint      | `<host>/users/forgot` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "email": "email",
}`

- Reset Password

| Name     | Reset           |
| ------------- |:-------------:|
| endpoint      | `<host>/users/reset` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "token": "token",
    "newPassword": "password",
    "confirmPassword": "password"
}`

- Logout

| Name     | Logout           |
| ------------- |:-------------:|
| endpoint      | `<host>/users/logout` |
| Body      | NO |
| AuthHeader | YES |

AuthHeader example: `Authorization: Bearer <token>`

