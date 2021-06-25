const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const restrictedOrigins = require("./middlewares/restrictedOrigins");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error(`ERROR: ${err}`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(restrictedOrigins);

app.use("/users", require("./routes/users"));

app.use("/cars", require("./routes/cars"));

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is OK",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
