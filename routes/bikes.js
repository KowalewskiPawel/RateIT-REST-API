const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const BikeController = require("../bikes/bike.controller.js");
const { validateToken } = require("../middlewares/validateToken");

router.get("/", BikeController.Bikes);

router.get("/:make", BikeController.FindBike);

router.get("/:make/all", BikeController.FindModels);

router.get("/:make/:model", BikeController.FindModel);

router.post("/", validateToken, cleanBody, BikeController.AddBike);

router.post(
  "/:make/:model",
  validateToken,
  cleanBody,
  BikeController.AddReview
);

router.put(
  "/:make/:model/:_id",
  validateToken,
  cleanBody,
  BikeController.EditReview
);

router.delete("/:make/:model/:_id", validateToken, BikeController.DeleteReview);

module.exports = router;
