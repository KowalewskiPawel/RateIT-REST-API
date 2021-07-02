import request from "supertest";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

import app from "../../app.js";

before(function (done) {
  this.timeout(3000);
  setTimeout(done, 2000);
});

describe("POST Create New User", () => {
  it("shouldn't accept empty email field", (done) => {
    request(app)
      .post("/users/signup")
      .send({ email: "", password: "asdf", confirmPassword: "asdf" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql(
          '"email" is not allowed to be empty'
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("shouldn't accept passwords that don't match", (done) => {
    request(app)
      .post("/users/signup")
      .send({
        email: "user@reviwit.com",
        password: "1234",
        confirmPassword: "123456",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql(
          '"confirmPassword" must be [ref:password]'
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("shouldn't accept email that already exists", (done) => {
    request(app)
      .post("/users/signup")
      .send({
        email: process.env.USER_TEST,
        password: "1234",
        confirmPassword: "1234",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.eql("Email is already in use");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("POST Login", () => {
  it("should accept exisiting user with correct credentials", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: process.env.USER_TEST,
        password: process.env.USER_TEST_PASSWORD,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.eql("User logged in successfully");
        done();
      })
      .catch((err) => done(err));
  });

  it("shouldn't accept invalid credentials", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: process.env.USER_TEST,
        password: "1234",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql("Invalid credentials");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("PATCH Activating the user account", () => {
  it("shouldn't accept invalid code", (done) => {
    request(app)
      .patch("/users/activate")
      .send({
        email: process.env.USER_TEST,
        code: "1234",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql("Invalid details");
        done();
      })
      .catch((err) => done(err));
  });
});

describe("PATCH Forgot the password", () => {
  it("should accept the exisiting account", (done) => {
    request(app)
      .patch("/users/forgot")
      .send({
        email: process.env.USER_TEST,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.message).to.be.eql(
          "Please check your email inbox for the reset code"
        );
        done();
      })
      .catch((err) => done(err));
  });

  it("shouldn't accept the wrong email address", (done) => {
    request(app)
      .patch("/users/forgot")
      .send({
        email: "aaaa",
      })
      .expect(500)
      .then((res) => {
        expect(res.body.message).to.be.eql(
          "Cannot read property 'email' of null"
        );
        done();
      })
      .catch((err) => done(err));
  });
});
