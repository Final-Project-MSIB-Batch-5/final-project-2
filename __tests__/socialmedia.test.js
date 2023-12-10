const app = require("../app");
const request = require("supertest");
const { User, Photo, Comment, Socialmedia } = require("../models");
const { generateToken } = require("../helpers/jwt");

const userData = {
  full_name: "Gaffur",
  email: "gaffur@gmail.com",
  username: "gaffur123",
  password: "123",
  profile_image_url: "admin.com",
  age: 20,
  phone_number: "081273849087",
};

describe("POST /socialmedias", () => {
  let UserId;
  let token;
  let PhotoId;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      UserId = user.id;
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      });
      const photoData = {
        title: "coba",
        caption: "coba",
        poster_image_url: "coba.com",
        UserId: UserId,
      };
      const photo = await Photo.create(photoData);
      PhotoId = photo.id;
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Photo.destroy({ where: {} });
      await Comment.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  // Success Testing Create Social Media
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send({
        name: "test",
        social_media_url: "test.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(201);
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toEqual("object");
        expect(res.body.socialmedia).toHaveProperty("id");
        expect(res.body.socialmedia).toHaveProperty("UserId");
        expect(res.body.socialmedia).toHaveProperty("name");
        expect(res.body.socialmedia).toHaveProperty("social_media_url");
        expect(res.body.socialmedia).toHaveProperty("updatedAt");
        expect(res.body.socialmedia).toHaveProperty("createdAt");
        done();
      });
  });

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .send({
        name: "test",
        social_media_url: "test.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.statusType).toEqual(4);
        expect(res.type).toEqual("application/json");
        expect(res.unauthorized).toEqual(true);
        expect(res.body).toHaveProperty("devMassage");
        expect(res.body.devMassage).toHaveProperty("name");
        expect(res.body.devMassage).toHaveProperty("message");
        expect(res.body.devMassage.name).toEqual("JsonWebTokenError");
        expect(res.body.devMassage.message).toEqual("jwt must be provided");
        done();
      });
  });

  // Error because the column is empties
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send({
        name: "",
        social_media_url: "",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.name).toEqual("SequelizeValidationError");
        expect(res.body.errors[0].message).toEqual("Name cannot be empty");
        expect(res.body.errors[0].type).toEqual("Validation error");
        done();
      });
  });
});

describe("GET /socialmedias", () => {
  let token;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      });
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  // Success Testing Get Social Media
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(200);
        expect(res.statusType).toEqual(2);
        expect(res.type).toEqual("application/json");
        expect(res.ok).toEqual(true);
        expect(res.body).toHaveProperty("social_medias");
        expect(typeof res.body.social_medias).toEqual("object");
        done();
      });
  });

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.statusType).toEqual(4);
        expect(res.type).toEqual("application/json");
        expect(res.unauthorized).toEqual(true);
        expect(res.body.devMassage).toHaveProperty("name");
        expect(res.body.devMassage).toHaveProperty("message");
        expect(res.body.devMassage.name).toEqual("JsonWebTokenError");
        expect(res.body.devMassage.message).toEqual("jwt must be provided");
        done();
      });
  });
});

describe("PUT /socialmedias/:id", () => {
  let UserId;
  let token;
  let socmedId;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      UserId = user.id;
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      });
      socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId,
      };
      const socmed = await Socialmedia.create(socmedData);
      socmedId = socmed.id;
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Socialmedia.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.statusType).toEqual(4);
        expect(res.type).toEqual("application/json");
        expect(res.unauthorized).toEqual(true);
        expect(res.body.devMassage).toHaveProperty("name");
        expect(res.body.devMassage).toHaveProperty("message");
        expect(res.body.devMassage.name).toEqual("JsonWebTokenError");
        expect(res.body.devMassage.message).toEqual("jwt must be provided");
        done();
      });
  });

  // Error because social_media_url field did not pass the validation
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("errors");
        expect(res.body).toHaveProperty("name");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0]).toHaveProperty("type");
        expect(res.body.errors[0].message).toEqual(
          "Social media URL cannot be empty"
        );
        expect(res.body.errors[0].type).toEqual("Validation error");
        done();
      });
  });

  // Error because socmedId not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/socialmedias/" + 999)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(404);
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("devMessage");
        expect(res.body.name).toEqual("Data not found");
        expect(res.body.devMessage).toEqual(
          "Social media with id 999 not found"
        );
        done();
      });
  });

  // Success Testing Update Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(200);
        expect(res.statusType).toEqual(2);
        expect(res.ok).toEqual(true);
        expect(res.body).toHaveProperty("social_medias");
        expect(res.type).toEqual("application/json");
        expect(typeof res.body.social_medias).toEqual("object");
        expect(res.body.social_medias[0]).toHaveProperty("id");
        expect(res.body.social_medias[0]).toHaveProperty("name");
        expect(res.body.social_medias[0]).toHaveProperty("social_media_url");
        expect(res.body.social_medias[0]).toHaveProperty("UserId");
        expect(res.body.social_medias[0]).toHaveProperty("createdAt");
        expect(res.body.social_medias[0]).toHaveProperty("updatedAt");

        done();
      });
  });
});

describe("DELETE /socialmedias/:id", () => {
  let UserId;
  let token;
  let socmedId;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      UserId = user.id;
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      });
      socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId,
      };
      const socmed = await Socialmedia.create(socmedData);
      socmedId = socmed.id;
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await Socialmedia.destroy({ where: {} });
    } catch (err) {
      console.log(err);
    }
  });

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .delete("/socialmedias/" + socmedId)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(401);
        expect(res.statusType).toEqual(4);
        expect(res.type).toEqual("application/json");
        expect(res.unauthorized).toEqual(true);
        expect(res.body.devMassage).toHaveProperty("name");
        expect(res.body.devMassage).toHaveProperty("message");
        expect(res.body.devMassage.name).toEqual("JsonWebTokenError");
        expect(res.body.devMassage.message).toEqual("jwt must be provided");
        done();
      });
  });

  // Error because did not input socmedId params
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete("/socialmedias/")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(res.notFound).toEqual(true);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("code");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("msg");
        expect(res.body.name).toEqual("Error");
        expect(res.body.code).toEqual(404);
        expect(res.body.msg).toEqual("Not Found");
        done();
      });
  });

  // Error because socmedId not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/socialmedias/" + 999)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(404);
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("devMessage");
        expect(res.body.name).toEqual("Data not found");
        expect(res.body.devMessage).toEqual(
          "Social media with id 999 not found"
        );
        done();
      });
  });

  // Success Testing Delete Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete("/socialMedias/" + socmedId)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(200);
        expect(res.statusType).toEqual(2);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body).toEqual("object");
        expect(res.body.message).toEqual(
          "Your social media has been successfuly deleted"
        );
        done();
      });
  });
});