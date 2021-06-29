import express from "express";
const bikesRouter = express.Router();

import cleanBody from "../middlewares/cleanbody.js";
import * as BikeController from "../bikes/bike.controller.js";
import validateToken from "../middlewares/validateToken.js";

bikesRouter.get("/", BikeController.Bikes);

bikesRouter.get("/:make", BikeController.FindBike);

bikesRouter.get("/:make/all", BikeController.FindModels);

bikesRouter.get("/:make/:model", BikeController.FindModel);

bikesRouter.post("/", validateToken, cleanBody, BikeController.AddBike);

bikesRouter.post(
  "/:make/:model",
  validateToken,
  cleanBody,
  BikeController.AddReview
);

bikesRouter.put(
  "/:make/:model/:_id",
  validateToken,
  cleanBody,
  BikeController.EditReview
);

bikesRouter.delete(
  "/:make/:model/:_id",
  validateToken,
  BikeController.DeleteReview
);

export default bikesRouter;
