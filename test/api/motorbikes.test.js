import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

import Bike from "../../bikes/bike.model.js";

import app from "../../app.js";

const tempBike = {
  make: "test",
  models: [
    {
      name: "testModel1",
      reviews: [],
    },
  ],
};

let tempToken;

let bikeID;

before(function (done) {
  this.timeout(3000);
  setTimeout(done, 2000);
});

before(async () => {
  try {
    let token;
    await request(app)
      .post("/users/login")
      .send({
        email: process.env.USER_TEST,
        password: process.env.USER_TEST_PASSWORD,
      })
      .then((res) => {
        return (token = res.body.accessToken);
      })
      .catch((err) => console.error(err));
    tempToken = await `Bearer ${token}`;
  } catch (err) {
    console.error(err);
  }
});

describe("GET bikes", () => {
  before(async () => {
    try {
      const testBike = new Bike(tempBike);
      await testBike.save();
    } catch (err) {
      console.error(err);
    }
  });

  it("should retrieve all of the bikes available in the DB", (done) => {
    request(app)
      .get("/bikes/")
      .expect(200)
      .then((res) => {
        expect(res.body[0].make).to.be.eql("test");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return the given bike model", (done) => {
    request(app)
      .get("/bikes/test")
      .expect(200)
      .then((res) => {
        expect(res.body[0].make).to.be.eql("test");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return the array of the given bike models", (done) => {
    request(app)
      .get("/bikes/test/all")
      .expect(200)
      .then((res) => {
        expect(res.body.models[0].name).to.be.eql("testModel1");
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    try {
      await Bike.deleteOne({ make: "test" });
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Bikes POST", () => {
  it("should add bike to the DB", (done) => {
    request(app)
      .post("/bikes/")
      .set({
        Authorization: tempToken,
      })
      .send(tempBike)
      .expect(201)
      .then((res) => {
        expect(res.body.message).to.be.eql("Bike Make added to the DB");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("should add new review to the given model", (done) => {
    request(app)
      .post("/bikes/test/testModel1")
      .set({
        Authorization: tempToken,
      })
      .send({
        Version: "Test",
        Year: 2020,
        Engine: "11",
        General: "Very pretty and sweet car I loved it so much.",
        Pros: "Very good for travelling",
        Cons: "Consumes a bit too much",
        User: "Pawel",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.message).to.be.eql("Review added to the DB");
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    try {
      await Bike.deleteOne({ make: "test" });
    } catch (err) {
      console.error(err);
    }
  });
});
