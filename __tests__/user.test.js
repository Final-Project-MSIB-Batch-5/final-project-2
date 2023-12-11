const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

// data user
const userDataTest = {
  email: "ravi@gmail.com",
  username: "ravi27",
  full_name: "Muhammad Ravi",
  password: "123",
  profile_image_url: "https://source.unsplash.com/3tYZjGSBwbk",
  age: 21,
  phone_number: "082739729473",
};

// data empty
const userDataEmptyTest = {
  email: "",
  username: "",
  full_name: "",
  password: "",
  profile_image_url: "",
  age: "",
  phone_number: "",
};

// data update
const userDataUpdateTest = {
  email: "admin@gmail.com",
  full_name: "Admin",
  username: "admin",
  profile_image_url: "https://source.unsplash.com/L1N7cMzM2KM",
  age: 28,
  phone_number: "0828616881",
};
let token;

// test api register
describe("POST /users/register", () => {
  beforeAll(async () => {
    try {
      await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
  // response success
  it("Should be response 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userDataTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("email", userDataTest.email);
        expect(res.body.user).toHaveProperty("username", userDataTest.username);
        expect(res.body.user).toHaveProperty(
          "full_name",
          userDataTest.full_name
        );
        expect(res.body.user).toHaveProperty(
          "profile_image_url",
          userDataTest.profile_image_url
        );
        expect(res.body.user).toHaveProperty("age", userDataTest.age);
        expect(res.body.user).toHaveProperty(
          "phone_number",
          userDataTest.phone_number
        );
        done();
      });
  });

  // response error (validation error)
  it("Should be response 422 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userDataEmptyTest)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(422);
        expect(res.body).toHaveProperty("errors");
        expect(typeof res.body).toEqual("object");
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors).toBeDefined();
        res.body.errors.map((error) => {
          expect(error).toHaveProperty("field");
          expect(error).toHaveProperty("message");
        });
        done();
      });
  });
});

// test api login
describe("POST /users/login", () => {
  // response success
  it("Should be response 200 status code", (done) => {
    request(app)
      .post("/users/login")
      .send({ email: userDataTest.email, password: userDataTest.password })
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("token");
        expect(res.body).toBeDefined();
        expect(res.body.token).toBeDefined();
        expect(typeof res.body.token).toEqual("string");
        token = res.body.token;
        done();
      });
  });

  // response error user not register
  it("Should be response 404 status code", (done) => {
    request(app)
      .post("/users/login")
      .send({ email: "usersalah@gmail.com", password: userDataTest.password })
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(res.body).toBeDefined();
        expect(res.body.error).toBeDefined();
        expect(res.body.error).toEqual("User not registered!");
        done();
      });
  });

  // response error password incorrect
  it("Should be response 401 status code", (done) => {
    request(app)
      .post("/users/login")
      .send({ email: userDataTest.email, password: "passwordsalah123" })
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("error");
        expect(res.body).toBeDefined();
        expect(res.body.error).toBeDefined();
        expect(res.body.error).toEqual("Incorrect password!");
        done();
      });
  });
});

// test api update user
describe("PUT /user/:UserId (response updatedUserById)", () => {
  let data;
  beforeAll(async () => {
    try {
      data = await User.findOne({
        where: {
          email: userDataTest.email,
        },
        attributes: ["id"],
      });
    } catch (error) {
      console.log(error);
    }
  });

  // response error 401 (not send token)
  it("Should be response 401 status code", (done) => {
    request(app)
      .put(`/users/${data.id}`)
      .send(userDataUpdateTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toBeDefined();
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // response error 422 (validation error)
  it("Should be response 422 status code", (done) => {
    request(app)
      .put(`/users/${data.id}`)
      .set("token", token)
      .send(userDataEmptyTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toBeDefined();
        res.body.errors.map((error) => {
          expect(error).toHaveProperty("field");
          expect(error).toHaveProperty("message");
        });
        done();
      });
  });

  // response error 404 (user not found)
  it("Should be response 404 status code", (done) => {
    request(app)
      .put(`/users/2000`)
      .set("token", token)
      .send(userDataUpdateTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toBeDefined();
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("User not found.");
        done();
      });
  });

  // success response
  it("Should be response 200 status code", (done) => {
    request(app)
      .put(`/users/${data.id}`)
      .set("token", token)
      .send(userDataUpdateTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user).toHaveProperty(
          "username",
          userDataUpdateTest.username
        );
        expect(res.body.user).toHaveProperty(
          "full_name",
          userDataUpdateTest.full_name
        );
        expect(res.body.user).toHaveProperty(
          "profile_image_url",
          userDataUpdateTest.profile_image_url
        );
        expect(res.body.user).toHaveProperty("age", userDataUpdateTest.age);
        expect(res.body.user).toHaveProperty(
          "phone_number",
          userDataUpdateTest.phone_number
        );
        done();
      });
  });
});

// test api deleted user
describe("DELETE /users/:UserId (response deletedUserById)", () => {
  let data;
  beforeAll(async () => {
    try {
      data = await User.findOne({
        where: {
          email: userDataUpdateTest.email,
        },
      });
      token = generateToken({
        id: data.id,
        email: data.email,
        username: data.username,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // response error 401 (not send token)
  it("Should be response 401 status code", (done) => {
    request(app)
      .put(`/users/${data.id}`)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toBeDefined();
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // response error (user not found)
  it("Should be response 404 status code", (done) => {
    request(app)
      .delete(`/users/2000`)
      .set("token", token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(404);
        expect(typeof res.body).toBe("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBeDefined();
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("User not found.");
        done();
      });
  });

  // response success
  it("Should be response 200 status code", (done) => {
    request(app)
      .delete(`/users/${data.id}`)
      .set("token", token)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toBeDefined();
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Your account has been successfully deleted"
        );
        done();
      });
  });

  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
