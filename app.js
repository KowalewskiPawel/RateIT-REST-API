import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import usersRouter from "./routes/users.js";
import carsRouter from "./routes/cars.js";
import bikesRouter from "./routes/bikes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

let database = process.env.MONGO_URI

if (process.env.NODE_ENV === "testing") {
  database = process.env.MONGO_URI_TEST;
}

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error(`ERROR: ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(helmet());

app.use("/users", usersRouter);
app.use("/cars", carsRouter);
app.use("/bikes", bikesRouter);

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

export default app;
