import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

import Car from "../../cars/car.model.js";

import app from "../../app.js";

const tempCar = {
  make: "test",
  models: [
    {
      name: "testModel1",
      reviews: [],
    },
  ],
};

let tempToken;

let carID;

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

describe("GET cars", () => {
  before(async () => {
    try {
      const testCar = new Car(tempCar);
      await testCar.save();
    } catch (err) {
      console.error(err);
    }
  });

  it("should retrieve all of the car available in the DB", (done) => {
    request(app)
      .get("/cars/")
      .expect(200)
      .then((res) => {
        expect(res.body[0].make).to.be.eql("test");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return the given car model", (done) => {
    request(app)
      .get("/cars/test")
      .expect(200)
      .then((res) => {
        expect(res.body[0].make).to.be.eql("test");
        done();
      })
      .catch((err) => done(err));
  });

  it("should return the array of the given car models", (done) => {
    request(app)
      .get("/cars/test/all")
      .expect(200)
      .then((res) => {
        expect(res.body.models[0].name).to.be.eql("testModel1");
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    try {
      await Car.deleteOne({ make: "test" });
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Cars POST", () => {
  it("should add car to the DB", (done) => {
    request(app)
      .post("/cars/")
      .set({
        Authorization: tempToken,
      })
      .send(tempCar)
      .expect(201)
      .then((res) => {
        expect(res.body.message).to.be.eql("Car Make added to the DB");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("should add new review to the given model", (done) => {
    request(app)
      .post("/cars/test/testModel1")
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
      await Car.deleteOne({ make: "test" });
    } catch (err) {
      console.error(err);
    }
  });
});

describe("PUT cars", () => {
  before(async () => {
    try {
      const testCar = new Car({
        make: "test",
        models: [
          {
            name: "testModel1",
            reviews: [
              {
                Version: "Test",
                Year: 2020,
                Engine: "11",
                General: "Very pretty and sweet car I loved it so much.",
                Pros: "Very good for travelling",
                Cons: "Consumes a bit too much",
                User: "Pawel",
              },
            ],
          },
        ],
      });
      const car = await testCar.save();

      carID = await car.models[0].reviews[0].id;
    } catch (err) {
      console.error(err);
    }
  });

  it("Users should be able to edit their reviews", (done) => {
    request(app)
      .put(`/cars/test/testModel1/${carID}`)
      .send({
        Version: "Test",
        Year: 2020,
        Engine: "1.4",
        General: "Very pretty and sweet car I loved it so much.",
        Pros: "Very good for travelling",
        Cons: "Consumes a bit too much",
        User: "Pawel",
      })
      .set({
        Authorization: tempToken,
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
      await Car.deleteOne({ make: "test" });
    } catch (err) {
      console.error(err);
    }
  });
});

describe("DELETE reviews", () => {
  before(async () => {
    try {
      const testCar = new Car({
        make: "test",
        models: [
          {
            name: "testModel1",
            reviews: [
              {
                Version: "Test",
                Year: 2020,
                Engine: "11",
                General: "Very pretty and sweet car I loved it so much.",
                Pros: "Very good for travelling",
                Cons: "Consumes a bit too much",
                User: "Pawel",
              },
            ],
          },
        ],
      });
      const car = await testCar.save();

      carID = await car.models[0].reviews[0].id;
    } catch (err) {
      console.error(err);
    }
  });

  it("Users should be able to delete their reviews", (done) => {
    request(app)
      .delete(`/cars/test/testModel1/${carID}`)
      .send({
        Version: "Test",
        Year: 2020,
        Engine: "1.4",
        General: "Very pretty and sweet car I loved it so much.",
        Pros: "Very good for travelling",
        Cons: "Consumes a bit too much",
        User: "Pawel",
      })
      .set({
        Authorization: tempToken,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.eql("Review removed from the DB");
        done();
      })
      .catch((err) => done(err));
  });

  after(async () => {
    try {
      await Car.deleteOne({ make: "test" });
      await request(app)
        .get("/users/logout")
        .set({
          Authorization: tempToken,
        })
        .then((res) => {})
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  });
});
