const chai = require("chai").expect;
const request = require("supertest");
const app = require("../../app.js");

require("dotenv").config();

describe("POST Create New User", () => {
  it("shouldn't accept empty email field", () => {
    request(app)
      .post("/users/signup")
      .send({ email: "", password: "asdf", confirmPassword: "asdf" })
      .expect(400)
      .then((res) => {
        const body = res.body.json();
        expect(body.message).to.be.eql('"email" is not allowed to be empty');
      });
  });

  it("shouldn't accept passwords that don't match", () => {
    request(app)
      .post("/users/signup")
      .send({
        email: "user@reviwit.com",
        password: "1234",
        confirmPassword: "123456",
      })
      .expect(400)
      .then((res) => {
        const body = res.body.json();
        expect(body.message).to.be.eql(
          '"confirmPassword" must be [ref:password]'
        );
      });
  });

  it("shouldn't accept email that already exists", () => {
    request(app)
      .post("/users/signup")
      .send({
        email: process.env.USER_TEST,
        password: "1234",
        confirmPassword: "1234",
      })
      .expect(200)
      .then((res) => {
        const body = res.body.json();
        expect(body.message).to.be.eql("Email is already in use");
      });
  });
});

describe("POST Login", () => {
  it("should accept exisiting user with correct credentials", () => {
    request(app)
      .post("/users/login")
      .send({
        email: process.env.USER_TEST,
        password: process.env.USER_TEST_PASSWORD,
      })
      .expect(200)
      .then((res) => {
        const body = res.json();
        expect(body.message).to.be.eql("User logged in successfully");
      });
  });

  it("shouldn't accept invalid credentials", () => {
    request(app)
      .post("/users/login")
      .send({
        email: process.env.USER_TEST,
        password: "1234",
      })
      .expect(400)
      .then((res) => {
        const body = res.json();
        expect(body.message).to.be.eql("Invalid credentials");
      });
  });
});

describe("PATCH Activating the user account", () => {
  it("shouldn't accept invalid code", () => {
    request(app)
      .patch("/users/activate")
      .send({
        email: process.env.USER_TEST,
        code: "1234",
      })
      .expect(400)
      .then((res) => {
        const body = res.json();
        expect(body.message).to.be.eql("Invalid details");
      });
  });
});

describe("PATCH Forgot the password", () => {
  it("should accept the exisiting account", () => {
    request(app)
      .patch("/users/forgot")
      .send({
        email: process.env.USER_TEST,
      })
      .expect(200)
      .then((res) => {
        const body = res.json();
        expect(body.message).to.be.eql(
          "Please check your email inbox for the reset code"
        );
      });
  });

  it("shouldn't accept the wrong email address", () => {
    request(app)
      .patch("/users/forgot")
      .send({
        email: "aaaa",
      })
      .expect(500)
      .then((res) => {
        const body = res.json();
        expect(body.message).to.be.eql("Cannot read property 'email' of null");
      });
  });
});
