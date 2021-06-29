import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bikeSchema = new Schema(
  {
    bikeId: { type: String, unique: true, require: true },
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

const Bike = mongoose.model("bike", bikeSchema);

export default Bike;
