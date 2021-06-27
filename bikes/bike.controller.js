const Joi = require("joi");
const { v4: uuid } = require("uuid");

const Bike = require("./bike.model");

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

exports.Bikes = async (req, res) => {
  try {
    let bikes = await Bike.find({});

    if (bikes.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "No Bikes in the DB",
      });
    }
    return res.json(bikes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find bikes",
    });
  }
};

exports.FindBike = async (req, res) => {
  try {
    let bike = await Bike.find({ make: req.params.make });

    if (bike.length < 1) {
      return res.json({
        error: true,
        status: 404,
        message: "Make doesn't exist",
      });
    }

    return res.json(bike);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Cannot find the given bike model",
    });
  }
};

exports.FindModels = async (req, res) => {
  try {
    let allModels = await Bike.findOne(
      { make: req.params.make },
      { models: 1 }
    );

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
      message: "Cannot find the given bike",
    });
  }
};

exports.FindModel = async (req, res) => {
  try {
    let oneModel = await Bike.findOne(
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

exports.AddBike = async (req, res) => {
  try {
    const result = bikeSchema.validate(req.body);
    if (result.error) {
      console.log(result.error.message);
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    let bike = await Bike.findOne({
      make: result.value.make,
    });

    if (bike) {
      return res.json({
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

exports.AddBike = async (req, res) => {
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

exports.DeleteReview = async (req, res) => {
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
