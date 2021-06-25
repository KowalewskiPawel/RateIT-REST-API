const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const CarController = require("../cars/car.controller.js");
const { validateToken } = require("../middlewares/validateToken");

router.get("/", CarController.Cars);

router.get("/:make", CarController.FindCar);

router.get("/:make/all", CarController.FindModels);

router.get("/:make/:model", CarController.FindModel);

router.post("/", validateToken, cleanBody, CarController.AddCar);

router.post("/:make/:model", validateToken, cleanBody, CarController.AddReview);

router.put(
  "/:make/:model/:_id",
  validateToken,
  cleanBody,
  CarController.EditReview
);

module.exports = router;
