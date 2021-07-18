# RateIT REST API

REST API for the RateIT project - interactive platform for sharing cars and motorcycles reviews.

### Installation

1. After cloning the repository install dependencies with the command `npm install` / `yarn install`
2. Create `.env` file in the main directory
3. Create MongoDB cluster and database.
4. Add your database address to the .env file as `MONGO_URI=<yourDBaddress>`
5. Add SendInBlue API key to the .env file as `SI_APIKEY=<yourSendInBlueAPIaddress>`
6. Add SendInBlue email address to the .env file as `SI_EMAIL=<yourSendInBlueEmailAddress`
7. Add JWT secret key (it's up to your personal choice) to the .env file as `JWT_SECRET=<yourJWTsecretKey>`
8. Type in `npm start` to run the server
9. Additionally, you may use command `npm test` for testing issues, but you will also have to add additional values to the .env file

## Routes

This API currently uses 3 main routes, for managing users, cars and motorbikes.

Documentation for the routes can be found [here](https://github.com/KowalewskiPawel/RateIT-REST-API/wiki/API-Routes)

