const request = require("supertest");
const app = require("../app");
const { Comment, User, Photo } = require("../models");
const { generateToken } = require("../helpers/jwt");

const userData = {
  full_name: "Gaffur",
  email: "gaffur@gmail.com",
  username: "gaffur123",
  password: "123",
  profile_image_url: "adminjpg.com",
  age: 20,
  phone_number: "081273849087",
};

describe("POST /comments", () => {
  let UserId;
  let PhotoId;
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
      const photoData = {
        title: "photo1",
        caption: "photo1",
        poster_image_url: "photo1.com",
        userId: UserId,
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

  // Success Testing Create Comment
  it("should be response 201 status code", (done) => {
    request(app)
      .post("/comments")
      .set("token", token)
      .send({
        comment: "komentar photo",
        PhotoId: PhotoId.toString(),
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(201);
          expect(typeof res.body).toEqual("object");
          expect(res.body.comment).toHaveProperty("id");
          expect(res.body.comment).toHaveProperty("comment");
          expect(res.body.comment).toHaveProperty("UserId");
          expect(res.body.comment).toHaveProperty("PhotoId");
          expect(res.body.comment).toHaveProperty("updatedAt");
          expect(res.body.comment).toHaveProperty("createdAt");
          done();
        }
      });
  });

  // Fail Testing Create Comment Because Comment Column Empty
  it("should be response 422 status code ", (done) => {
    request(app)
      .post("/comments")
      .set("token", token)
      .send({
        comment: "",
        PhotoId: PhotoId.toString(),
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(422);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("errors");
          expect(res.body.errors[0]).toHaveProperty("field");
          expect(res.body.errors[0]).toHaveProperty("message");
          expect(res.body.errors[0].field).toEqual("comment");
          expect(res.body.errors[0].message).toEqual("Comment be required.");
          done();
        }
      });
  });

  // Fail Testing Create Comment Because No Token
  it("should be response 401 status code ", (done) => {
    request(app)
      .post("/comments")
      .send({
        comment: "komentar photo",
        PhotoId: PhotoId.toString(),
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toEqual(401);
          expect(res.unauthorized).toEqual(true);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Token not provided!");
          done();
        }
      });
  });
});

describe("GET /comments", () => {
  let token = "";

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      const photoData = {
        title: "photo1",
        caption: "photo1",
        poster_image_url: "photo1.com",
        userId: user.id,
      };
      await Photo.create(photoData);
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

  // Success Testing Get Comment
  it("should be respond with 200 status code", (done) => {
    request(app)
      .get("/comments")
      .set("token", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.type).toEqual("application/json");
          expect(res.body).toBeDefined();
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("comments");
          expect(Array.isArray(res.body.comments)).toBe(true);
          done();
        }
      });
  });

  // Fail Testing Get Comment Because No Token
  it("should be respond with 401 status code", (done) => {
    request(app)
      .get("/comments")
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body).toBeDefined();
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Token not provided!");
          done();
        }
      });
  });
});

describe("PUT /comments/:id", () => {
  let commentId;
  let token;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      const photoData = {
        title: "photo1",
        caption: "photo1",
        poster_image_url: "photo1.com",
        userId: user.id,
      };
      const photo = await Photo.create(photoData);

      const commentData = {
        comment: "initial comment",
        UserId: user.id,
        PhotoId: photo.id,
      };
      const comment = await Comment.create(commentData);
      commentId = comment.id;
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

  // Success Testing Update Comment
  it("should respond with 200 status code and updated comment", (done) => {
    request(app)
      .put(`/comments/${commentId}`)
      .set("token", token)
      .send({
        comment: "updated comment",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(typeof res.body).toEqual("object");
          expect(res.body.comment).toHaveProperty("id");
          expect(res.body.comment).toHaveProperty("comment");
          expect(res.body.comment).toHaveProperty("UserId");
          expect(res.body.comment).toHaveProperty("PhotoId");
          expect(res.body.comment).toHaveProperty("updatedAt");
          expect(res.body.comment).toHaveProperty("createdAt");
          done();
        }
      });
  });

  // Fail Testing Update Comment Because No Token
  it("should respond with 401 status code and updated comment", (done) => {
    request(app)
      .put(`/comments/${commentId}`)
      .send({
        comment: "updated comment",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body).toBeDefined();
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Token not provided!");
          done();
        }
      });
  });

  // Fail Testing Update Comment Because Column Comment Empty
  it("should be respond with 422 status code", (done) => {
    request(app)
      .put(`/comments/${commentId}`)
      .set("token", token)
      .send({
        comment: "",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(422);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("errors");
          expect(res.body.errors[0]).toHaveProperty("field");
          expect(res.body.errors[0]).toHaveProperty("message");
          expect(Array.isArray(res.body.errors)).toBe(true);
          done();
        }
      });
  });

  // Fail Testing Update Comment Because Unauthorized
  it("should be respond with 404 status code", (done) => {
    request(app)
      .put(`/comments/9999`)
      .set("token", token)
      .send({
        comment: "updated comment",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(404);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toHaveProperty("message");
          expect(res.body).toBeDefined();
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Comment not found.");
          done();
        }
      });
  });
});

describe("DELETE /comments/:id", () => {
  let commentId;
  let token;

  beforeAll(async () => {
    try {
      const user = await User.create(userData);
      token = generateToken({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      const photoData = {
        title: "photo1",
        caption: "photo1",
        poster_image_url: "photo1.com",
        userId: user.id,
      };
      const photo = await Photo.create(photoData);

      const commentData = {
        comment: "initial comment",
        UserId: user.id,
        PhotoId: photo.id,
      };
      const comment = await Comment.create(commentData);
      commentId = comment.id;
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

  // Success Testing Delete Comment
  it("should be respond with 200 status code", (done) => {
    request(app)
      .delete(`/comments/${commentId}`)
      .set("token", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.type).toEqual("application/json");
          expect(res.body).toHaveProperty("message");
          expect(res.body).toBeDefined();
          expect(typeof res.body).toEqual("object");
          expect(res.body.message).toEqual(
            "Your comment has been successfully deleted"
          );
          done();
        }
      });
  });

  // Fail Testing Delete Comment Because No Token
  it("should be respond with 401 status code", (done) => {
    request(app)
      .delete(`/comments/${commentId}`)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toBeDefined();
          expect(res.body).toHaveProperty("message");
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Token not provided!");
          done();
        }
      });
  });

  // Fail Testing Delete Comment Because Unauthorized
  it("should be respond with 404 status code", (done) => {
    request(app)
      .delete(`/comments/${commentId}`)
      .set("token", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(404);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toBeDefined();
          expect(res.body).toHaveProperty("message");
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual("Comment not found.");
          done();
        }
      });
  });

  // Fail Testing Delete Comment Because commentId params not int
  it("should be respond with 400 status code", (done) => {
    request(app)
      .delete(`/comments/sssss`)
      .set("token", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(400);
          expect(typeof res.body).toEqual("object");
          expect(res.body).toBeDefined();
          expect(res.body).toHaveProperty("message");
          expect(typeof res.body.message).toEqual("string");
          expect(res.body.message).toEqual(
            "Invalid commentId. It should be an integer."
          );
          done();
        }
      });
  });
});
