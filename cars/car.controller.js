import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuid } from "uuid";

import Car from "./car.model.js";

const carSchema = Joi.object().keys({
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

const Cars = async (req, res) => {
  try {
    let cars = await Car.find({});

    if (cars.length < 1) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "No Cars in the DB",
      });
    }
    return res.status(200).json(cars);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find cars",
    });
  }
};

const FindCar = async (req, res) => {
  try {
    let car = await Car.find({ make: req.params.make });

    if (car.length < 1) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }

    return res.status(200).json(car);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given car model",
    });
  }
};

const FindModels = async (req, res) => {
  try {
    let allModels = await Car.findOne({ make: req.params.make }, { models: 1 });

    if (allModels.length < 1) {
      return res.status(404).json({
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
      message: "Cannot find the given car",
    });
  }
};

const FindModel = async (req, res) => {
  try {
    let oneModel = await Car.findOne(
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

const AddCar = async (req, res) => {
  try {
    const result = carSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.status(400).json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    let car = await Car.findOne({
      make: result.value.make,
    });

    if (car) {
      return res.status(409).json({
        error: true,
        message: "Make already exist",
      });
    }

    const id = uuid();
    result.value.carId = id;

    const newCar = new Car(result.value);

    await newCar.save();

    return res.status(201).json({
      success: true,
      message: "Car Make added to the DB",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot add the car make",
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

    await Car.updateOne(
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
    message: "Cannot add the car review",
  });
};

const EditReview = async (req, res) => {
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

    await Car.findOneAndUpdate(
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
      message: "Cannot add the car review",
    });
  }
};

const DeleteReview = async (req, res) => {
  try {
    await Car.findOneAndUpdate(
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
  Cars,
  FindCar,
  FindModels,
  FindModel,
  AddCar,
  AddReview,
  EditReview,
  DeleteReview,
};
