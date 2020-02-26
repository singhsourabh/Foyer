const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const dbHandler = require("./db-handler");
const assert = require("assert");

// dotenv.config({ path: path.resolve(__dirname, "./../.env") });
const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

beforeAll(async () => await dbHandler.connect());

// afterEach(async () => await dbHandler.clearDatabase());

afterAll(async () => await dbHandler.closeDatabase());

let adminToken, coreToken, manageToken, tempID, zealID, logDay;

describe("Registration", () => {
  it("Create registration", async done => {
    await request
      .post("/api/v1/reg")
      .send({
        name: "test",
        email: "d2412963@urhen.com",
        mobile: 9059926129,
        admissionNo: "17cse001"
      })
      .expect(200)
      .then(response => {
        tempID = response.body.data.data.tempID;
      });
    done();
  });
});

describe("User creation and Auth", () => {
  it("Admin login", async done => {
    await request
      .post("/api/v1/users/login")
      .send({
        email: "admin@test.com",
        password: "qwerty123"
      })
      .expect(200)
      .then(response => {
        assert(response.body.data.user.role, "admin");
        adminToken = response.body.token;
      });
    done();
  });

  it("Create Core team", async done => {
    await request
      .post("/api/v1/users/")
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        name: "test ctc",
        email: "testcore@gmail.com",
        password: "qwerty123",
        passwordConfirm: "qwerty123"
      })
      .expect(201);
    done();
  });

  it("Core-team login", async done => {
    await request
      .post("/api/v1/users/login")
      .send({
        email: "testcore@gmail.com",
        password: "qwerty123"
      })
      .expect(200)
      .then(response => {
        assert(response.body.data.user.role, "core-team");
        coreToken = response.body.token;
      });
    done();
  });

  it("Create Management team", async done => {
    await request
      .post("/api/v1/users/")
      .set({ Authorization: `Bearer ${coreToken}` })
      .send({
        name: "test manage",
        email: "manage@test.com",
        password: "qwerty123",
        passwordConfirm: "qwerty123"
      })
      .expect(201);
    done();
  });

  it("Management login", async done => {
    const res = await request
      .post("/api/v1/users/login")
      .send({
        email: "manage@test.com",
        password: "qwerty123"
      })
      .expect(200)
      .then(response => {
        assert(response.body.data.user.role, "management");
        manageToken = response.body.token;
      });
    done();
  });
});

describe("Approve registration", () => {
  it("Approve", async done => {
    await request
      .post("/api/v1/reg/approve")
      .set({ Authorization: `Bearer ${coreToken}` })
      .send({
        tempID: tempID
      })
      .expect(200)
      .then(response => {
        zealID = response.body.data.zealID;
      });
    done();
  });
});

describe("Registration", () => {
  it("Search wrong registration", async done => {
    await request.get("/api/v1/reg/search/?tag=random").expect(404);
    done();
  });

  it("Search registration by admission no", async done => {
    await request.get("/api/v1/reg/search/?tag=17cse001").expect(200);
    done();
  });

  it("Search registration by tempID", async done => {
    await request.get(`/api/v1/reg/search/?tag=${tempID}`).expect(200);
    done();
  });
});

describe("Entry Log", () => {
  it("Post logs", async done => {
    await request
      .post(`/api/v1/reg/management/${zealID}`)
      .set({ Authorization: `Bearer ${manageToken}` })
      .expect(200)
      .then(response => {
        logDay = response.body.data.registration.entryLog;
      });
    done();
  });

  it("Get logs", async done => {
    await request
      .get(`/api/v1/reg/management/${zealID}`)
      .set({ Authorization: `Bearer ${manageToken}` })
      .expect(200)
      .then(response => {
        assert(logDay, response.body.data.registration.entryLog);
      });
    done();
  });
});
