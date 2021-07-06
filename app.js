import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import usersRouter from "./routes/users.js";
import carsRouter from "./routes/cars.js";
import bikesRouter from "./routes/bikes.js";

dotenv.config();

//const restrictedOrigins = require("./middlewares/restrictedOrigins");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
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

app.use(cors());

//app.use(restrictedOrigins);

app.use("/users", usersRouter);
app.use("/cars", carsRouter);
app.use("/bikes", bikesRouter);

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is OK",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

export default app;
