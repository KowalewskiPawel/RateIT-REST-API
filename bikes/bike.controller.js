import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuid } from "uuid";

import Bike from "./bike.model.js";

const bikeSchema = Joi.object().keys({
  make: Joi.string().required().min(2),
  models: Joi.array().required().min(1),
});

const reviewSchema = Joi.object().keys({
  Version: Joi.string().required().min(2),
  Year: Joi.number().required().min(4),
  Engine: Joi.string().required().min(2),
  General: Joi.string().required().min(10),
  Pros: Joi.string().required().min(4),
  Cons: Joi.string().required().min(4),
  User: Joi.string().required().min(2),
});

const Bikes = async (req, res) => {
  try {
    let bikes = await Bike.find({});

    if (bikes.length < 1) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "No Bikes in the DB",
      });
    }
    return res.status(200).json(bikes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find bikes",
    });
  }
};

const FindBike = async (req, res) => {
  try {
    let bike = await Bike.find({ make: req.params.make });

    if (bike.length < 1) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }

    return res.status(200).json(bike);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given bike model",
    });
  }
};

const FindModels = async (req, res) => {
  try {
    let allModels = await Bike.findOne(
      { make: req.params.make },
      { models: 1 }
    );

    if (allModels.length < 1) {
      return res.status(400).json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }
    return res.status(200).json(allModels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given bike",
    });
  }
};

const FindModel = async (req, res) => {
  try {
    let oneModel = await Bike.findOne(
      { make: req.params.make },
      { models: { $elemMatch: { name: req.params.model } } }
    );

    if (oneModel.models.length < 1) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Model doesn't exist",
      });
    }
    return res.status(200).json(oneModel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given model",
    });
  }
};

const AddBike = async (req, res) => {
  try {
    const result = bikeSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    let bike = await Bike.findOne({
      make: result.value.make,
    });

    if (bike) {
      return res.status(409).json({
        error: true,
        message: "Make already exist",
      });
    }

    const id = uuid();
    result.value.bikeId = id;

    const newBike = new Bike(result.value);

    await newBike.save();

    return res.status(201).json({
      success: true,
      message: "Bike Make added to the DB",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot add the bike make",
    });
  }
};

const AddReview = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    await Bike.updateOne(
      { make: req.params.make, "models.name": req.params.model },
      { $push: { "models.$.reviews": result.value } }
    );

    return res.status(201).json({
      success: true,
      message: "Review added to the DB",
    });
  } catch (error) {}
  console.error(error);
  return res.status(500).json({
    error: true,
    message: "Cannot add the bike review",
  });
};

const EditReview = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).reviewSchemajson({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    await Bike.findOneAndUpdate(
      {
        make: req.params.make,
      },
      { $set: { "models.$[e1].reviews.$[e2]": result.value } },
      {
        arrayFilters: [
          { "e1.name": req.params.model },
          { "e2._id": req.params._id },
        ],
      }
    );

    return res.status(201).json({
      success: true,
      message: "Review added to the DB",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot add the bike review",
    });
  }
};

const DeleteReview = async (req, res) => {
  try {
    await Bike.findOneAndUpdate(
      {
        make: req.params.make,
      },
      { $pull: { "models.$[e1].reviews": { _id: req.params._id } } },
      {
        arrayFilters: [
          { "e1.name": req.params.model },
          { "e2._id": req.params._id },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      message: "Review removed from the DB",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot delete the review",
    });
  }
};

export {
  Bikes,
  FindBike,
  FindModels,
  FindModel,
  AddBike,
  AddReview,
  EditReview,
  DeleteReview,
};
