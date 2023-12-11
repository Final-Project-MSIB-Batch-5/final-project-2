const app = require("../app");
const request = require("supertest");
const { User, Comment, SocialMedia } = require("../models");
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

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      UserId = user.id;
      token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
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
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(201);
        expect(res.type).toEqual("application/json");
        expect(typeof res.body).toEqual("object");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.body.social_media).toHaveProperty("UserId");
        expect(res.body.social_media).toHaveProperty("name");
        expect(res.body.social_media).toHaveProperty("social_media_url");
        expect(res.body.social_media).toHaveProperty("updatedAt");
        expect(res.body.social_media).toHaveProperty("createdAt");
        done();
      });
  });

  // Error 401 for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .send({
        name: "test",
        social_media_url: "test.com",
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
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // Error because the column is empties
  it("should send response with 422 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send({
        name: "",
        social_media_url: "",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(422);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("field");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0].message).toEqual("Name cannot be empty");
        expect(res.body.errors[0].field).toEqual("name");
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
        username: user.username,
      });
      await SocialMedia.create({
        name: "test",
        social_media_url: "test.com",
        UserId: user.id,
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
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
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
        username: user.username,
      });
      socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId: UserId,
      };
      const socmed = await SocialMedia.create(socmedData);
      socmedId = socmed.id;
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
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
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // Error because social_media_url field did not pass the validation
  it("should send response with 422 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(422);
        expect(res.type).toEqual("application/json");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0]).toHaveProperty("field");
        expect(res.body.errors[0].message).toEqual(
          "Social media URL cannot be empty"
        );
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
        expect(res.body).toBeDefined();
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Social Media not found");
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
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        // Min 5 expects
        expect(res.status).toEqual(200);
        expect(res.statusType).toEqual(2);
        expect(res.ok).toEqual(true);
        expect(res.body).toHaveProperty("social_media");
        expect(res.type).toEqual("application/json");
        expect(typeof res.body.social_media).toEqual("object");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.body.social_media).toHaveProperty("name");
        expect(res.body.social_media).toHaveProperty("social_media_url");
        expect(res.body.social_media).toHaveProperty("UserId");
        expect(res.body.social_media).toHaveProperty("createdAt");
        expect(res.body.social_media).toHaveProperty("updatedAt");

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
        username: user.username,
      });
      const socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId: UserId,
      };
      const socmed = await SocialMedia.create(socmedData);
      socmedId = socmed.id;
    } catch (err) {
      console.log(err);
    }
  });
  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
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
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Token not provided!");
        done();
      });
  });

  // Error because did not input socmedId params
  it("should send response with 400 status code", (done) => {
    request(app)
      .delete("/socialmedias/ss")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(res.type).toEqual("application/json");
        expect(res.body).toBeDefined();
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Invalid socialMediaId. It should be an integer."
        );

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
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Social Media not found");
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
          "Your social media has been successfully deleted"
        );
        done();
      });
  });
});
