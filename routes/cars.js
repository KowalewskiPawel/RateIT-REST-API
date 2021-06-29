import express from "express";
const carsRouter = express.Router();

import cleanBody from "../middlewares/cleanbody.js";
import * as CarController from "../cars/car.controller.js";
import validateToken from "../middlewares/validateToken.js";

carsRouter.get("/", CarController.Cars);

carsRouter.get("/:make", CarController.FindCar);

carsRouter.get("/:make/all", CarController.FindModels);

carsRouter.get("/:make/:model", CarController.FindModel);

carsRouter.post("/", validateToken, cleanBody, CarController.AddCar);

carsRouter.post(
  "/:make/:model",
  validateToken,
  cleanBody,
  CarController.AddReview
);

carsRouter.put(
  "/:make/:model/:_id",
  validateToken,
  cleanBody,
  CarController.EditReview
);

carsRouter.delete(
  "/:make/:model/:_id",
  validateToken,
  CarController.DeleteReview
);

export default carsRouter;
