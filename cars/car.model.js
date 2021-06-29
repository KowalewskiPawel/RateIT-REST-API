import mongoose from "mongoose";
const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    carId: { type: String, unique: true, require: true },
    make: { type: String, unique: true, require: true },
    models: [
      {
        name: { type: String, unique: true },
        reviews: [
          {
            Version: { type: String, require: true },
            Year: { type: Number, require: true },
            Engine: { type: String, requite: true },
            General: { type: String, require: true },
            Pros: { type: String, require: true },
            Cons: { type: String, require: true },
            User: { type: String, require: true },
            Date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Car = mongoose.model("car", carSchema);

export default Car;
