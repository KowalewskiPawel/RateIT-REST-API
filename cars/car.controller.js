const Joi = require("joi");
const { v4: uuid } = require("uuid");

const Car = require("./car.model");

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

exports.Cars = async (req, res) => {
  try {
    let cars = await Car.find({});

    if (cars.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "No Cars in the DB",
      });
    }
    return res.json(cars);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find cars",
    });
  }
};

exports.FindCar = async (req, res) => {
  try {
    let car = await Car.find({ make: req.params.make });

    if (car.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }

    return res.json(car);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given car model",
    });
  }
};

exports.FindModels = async (req, res) => {
  try {
    let allModels = await Car.findOne({ make: req.params.make }, { models: 1 });

    if (allModels.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }
    return res.json(allModels);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given car",
    });
  }
};

exports.FindModel = async (req, res) => {
  try {
    let oneModel = await Car.findOne(
      { make: req.params.make },
      { models: { $elemMatch: { name: req.params.model } } }
    );

    if (oneModel.models.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "Model doesn't exist",
      });
    }
    return res.json(oneModel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given model",
    });
  }
};

exports.AddCar = async (req, res) => {
  try {
    const result = carSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    let car = await Car.findOne({
      make: result.value.make,
    });

    if (car) {
      return res.json({
        error: true,
        message: "Make already exist",
      });
    }

    const id = uuid();
    result.value.carId = id;

    const newCar = new Car(result.value);

    await newCar.save();

    return res.status(200).json({
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

exports.AddReview = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    await Car.updateOne(
      { make: req.params.make, "models.name": req.params.model },
      { $push: { "models.$.reviews": result.value } }
    );

    return res.status(200).json({
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

exports.EditReview = async (req, res) => {
  try {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    const tempCar = await Car.findOneAndUpdate(
      {
        make: req.params.make,
      },
      // "models.name": req.params.model,
      //   "reviews._id": req.params._id,
      { $set: { "models.$[e1].reviews.$[e2]": result.value } },
      {
        arrayFilters: [
          { "e1.name": req.params.model },
          { "e2._id": req.params._id },
        ],
      }
    );

    return res.status(200).json({
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
