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

## Users

- Signup

| Name     | Signup           |
| ------------- |:-------------:|
| Method | POST |
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
| Method | POST |
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
| Method | PATCH |
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
| Method | PATCH |
| endpoint      | `<host>/users/forgot` |
| Body      | YES |
| AuthHeader | NO |

Body example: `{
    "email": "email",
}`

- Reset Password

| Name     | Reset           |
| ------------- |:-------------:|
| Method | PATCH |
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
| Method | GET |
| endpoint      | `<host>/users/logout` |
| Body      | NO |
| AuthHeader | YES |

AuthHeader example: `Authorization: Bearer <token>`

## Bikes

- Retrieve Bikes

| Name     | Bikes           |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/bikes` |
| Body      | NO |
| AuthHeader | NO |

- Find One Bike

| Name     |       FindBike     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/bikes/:make` |
| Body      | NO |
| AuthHeader | NO |

- Find All Models of a Specific Bike Make

| Name     |       FindModels     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/bikes/:make/all` |
| Body      | NO |
| AuthHeader | NO |

- Find One Model of a Specific Bike Make

| Name     |       FindModel     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/bikes/:make/:model` |
| Body      | NO |
| AuthHeader | NO |

- Add New Bike to the DB

| Name     |     AddBike       |
| ------------- |:-------------:|
| Method | POST |
| endpoint      | `<host>/bikes/` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "make": "name",
    "models": [
        {"name": "name",
        "reviews": []}
    ]
}`

AuthHeader example: `Authorization: Bearer <token>`


- Add New Review to the Given Bike

| Name     |     AddReview       |
| ------------- |:-------------:|
| Method | POST |
| endpoint      | `<host>/bikes/:make/:model` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "Version": "name",
    "Year": Number,
    "Engine": "name",
    "General": "text",
    "Pros": "text",
    "Cons": "text",
    "User": "userName"
}`

AuthHeader example: `Authorization: Bearer <token>`

- Edit the Review of the Given Bike

| Name     |     EditReview       |
| ------------- |:-------------:|
| Method | PUT |
| endpoint      | `<host>/bikes/:make/:model/:_id` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "Version": "name",
    "Year": Number,
    "Engine": "name",
    "General": "text",
    "Pros": "text",
    "Cons": "text",
    "User": "userName"
}`

AuthHeader example: `Authorization: Bearer <token>`


- Delete the Review of the Given Bike

| Name     |     DeleteReview       |
| ------------- |:-------------:|
| Method | DELETE |
| endpoint      | `<host>/bikes/:make/:model/:_id` |
| Body      | NO |
| AuthHeader | YES |


AuthHeader example: `Authorization: Bearer <token>`

## Cars

- Retrieve Cars

| Name     | Cars           |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/cars` |
| Body      | NO |
| AuthHeader | NO |

- Find One Car

| Name     |       FindCar     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/cars/:make` |
| Body      | NO |
| AuthHeader | NO |

- Find All Models of a Specific Car Make

| Name     |       FindModels     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/cars/:make/all` |
| Body      | NO |
| AuthHeader | NO |

- Find One Model of a Specific Car Make

| Name     |       FindModel     |
| ------------- |:-------------:|
| Method | GET |
| endpoint      | `<host>/cars/:make/:model` |
| Body      | NO |
| AuthHeader | NO |

- Add New Car to the DB

| Name     |     AddCar       |
| ------------- |:-------------:|
| Method | POST |
| endpoint      | `<host>/cars/` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "make": "name",
    "models": [
        {"name": "name",
        "reviews": []}
    ]
}`

AuthHeader example: `Authorization: Bearer <token>`


- Add New Review to the Given Car

| Name     |     AddReview       |
| ------------- |:-------------:|
| Method | POST |
| endpoint      | `<host>/cars/:make/:model` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "Version": "name",
    "Year": Number,
    "Engine": "name",
    "General": "text",
    "Pros": "text",
    "Cons": "text",
    "User": "userName"
}`

AuthHeader example: `Authorization: Bearer <token>`

- Edit the Review of the Given Car

| Name     |     EditReview       |
| ------------- |:-------------:|
| Method | PUT |
| endpoint      | `<host>/cars/:make/:model/:_id` |
| Body      | YES |
| AuthHeader | YES |

Body example: `{
    "Version": "name",
    "Year": Number,
    "Engine": "name",
    "General": "text",
    "Pros": "text",
    "Cons": "text",
    "User": "userName"
}`

AuthHeader example: `Authorization: Bearer <token>`


- Delete the Review of the Given Car

| Name     |     DeleteReview       |
| ------------- |:-------------:|
| Method | DELETE |
| endpoint      | `<host>/cars/:make/:model/:_id` |
| Body      | NO |
| AuthHeader | YES |


AuthHeader example: `Authorization: Bearer <token>`


