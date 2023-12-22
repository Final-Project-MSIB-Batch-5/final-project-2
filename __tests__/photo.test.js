const request = require("supertest");
const app = require("../app");
const { User, Photo } = require("../models");
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

// data photo
const photoDataTest = {
  poster_image_url: "https://source.unsplash.com/O7NHbnjrz94",
  title: "Foto Sunrise",
  caption: "Foto sunrise di danau.",
};

// data photo update
const photoDataUpdateTest = {
  poster_image_url: "https://source.unsplash.com/L95xDkSSuWw",
  title: "Foto pemandangan dimalam hari",
  caption: "Foto pemandangan dimalam hari di danau.",
};

// data photo empty
const photoDataEmptyTest = {
  poster_image_url: "",
  title: "",
  caption: "",
};

let token;
let dataUser;
let dataUserCreate;
let photoId;
let authLogin;
describe("POST /photos", () => {
  beforeAll(async () => {
    try {
      await Photo.destroy({ where: {} });
      await User.destroy({ where: {} });
      dataUserCreate = await request(app)
        .post("/users/register")
        .send(userDataTest);
      dataUser = await User.findOne({ where: { email: userDataTest.email } });
      authLogin = await request(app)
        .post("/users/login")
        .send({ email: userDataTest.email, password: userDataTest.password });

      token = authLogin.body.token;
    } catch (error) {
      console.log(error);
    }
  });

  // response success
  it("Should be response 201 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(photoDataTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty(
          "poster_image_url",
          photoDataTest.poster_image_url
        );
        expect(res.body).toHaveProperty("title", photoDataTest.title);
        expect(res.body).toHaveProperty("caption", photoDataTest.caption);
        expect(res.body).toHaveProperty("UserId", dataUser.id);
        photoId = res.body.id;
        done();
      });
  });

  // response error 422 (validation error)
  it("Should be response 422 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(photoDataEmptyTest)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("errors");
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors).toBeDefined();
        res.body.errors.map((error) => {
          expect(error).toHaveProperty("field");
          expect(error).toHaveProperty("message");
        });

        done();
      });
  });

  // response error 401 (not send token)
  it("Should be response 401 status code", (done) => {
    request(app)
      .put("/photos")
      .send(photoDataTest)
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
});

describe("GET /photos", () => {
  // response success
  it("Should be response 200 status code", (done) => {
    request(app)
      .get("/photos")
      .set("token", token)
      .end((err, res) => {
        if (err) done(err);

        expect(res.status).toBe(200);

        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("photos");
        expect(res.body).toBeDefined();
        expect(res.body.photos).toBeDefined();
        expect(Array.isArray(res.body.photos)).toBe(true);
        res.body.photos.map((photo) => {
          expect(photo).toHaveProperty("id");
          expect(photo).toHaveProperty("title");
          expect(photo).toHaveProperty("caption");
        });
        done();
      });
  });

  // response error 401 (token not found)
  it("Should be response 401 status code", (done) => {
    request(app)
      .get("/photos")
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
});

describe("PUT /photos/photoId", () => {
  // response success
  it("Should be response 200 status code", (done) => {
    request(app)
      .put(`/photos/${photoId}`)
      .set("token", token)
      .send(photoDataUpdateTest)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);

        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("photo");
        expect(res.body.photo).toBeDefined();
        expect(res.body.photo).toHaveProperty("id");
        expect(res.body.photo).toHaveProperty(
          "title",
          photoDataUpdateTest.title
        );
        expect(res.body.photo).toHaveProperty(
          "caption",
          photoDataUpdateTest.caption
        );
        expect(res.body.photo).toHaveProperty(
          "poster_image_url",
          photoDataUpdateTest.poster_image_url
        );
        expect(res.body.photo).toHaveProperty("UserId", dataUser.id);
        expect(res.body.photo).toHaveProperty("createdAt");
        expect(res.body.photo).toHaveProperty("updatedAt");

        done();
      });
  });

  // response error 401 (token not found)
  it("Should be response 401 status code", (done) => {
    request(app)
      .put(`/photos/${photoId}`)
      .send(photoDataUpdateTest)
      .end((err, res) => {
        if (err) return done(err);

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
      .put(`/photos/${photoId}`)
      .set("token", token)
      .send(photoDataEmptyTest)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBe(true);
        res.body.errors.map((error) => {
          expect(error).toHaveProperty("field");
          expect(error).toHaveProperty("message");
        });
        done();
      });
  });

  // response error 404 (photo not found)
  it("Should be response 404 status code", (done) => {
    request(app)
      .put(`/photos/2000`)
      .set("token", token)
      .send(photoDataUpdateTest)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toBeDefined;
        expect(res.body.message).toEqual("Photo not found.");
        done();
      });
  });
});

describe("DELETE /photos/photoId", () => {
  // response error 401 (token not found)
  it("Should be response 401 status code", (done) => {
    request(app)
      .delete(`/photos/${photoId}`)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toBeDefined();
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // response error 404 (photo not found)
  it("Should be response 404 status code", (done) => {
    request(app)
      .delete(`/photos/2000`)
      .set("token", token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Photo not found.");
        done();
      });
  });

  // response error 400 (photoId params not int)
  it("Should be response 400 status code", (done) => {
    request(app)
      .delete(`/photos/ssss`)
      .set("token", token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Invalid photoId. It should be an integer."
        );
        done();
      });
  });
  // response success
  it("Should be response 200 status code", (done) => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set("token", token)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).toBe(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Your photo has been successfully deleted"
        );
        done();
      });
  });
  afterAll(async () => {
    try {
      await Photo.destroy({ where: {} });
      await User.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
