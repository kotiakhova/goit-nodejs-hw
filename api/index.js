const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./contacts/contact.router");
const userRouter = require("./users/user.router");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
    this.server.use(morgan("tiny"));
  }
  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
    this.server.use("", userRouter);
  }
  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log(`Database connection failed`);
      process.exit(1);
    }
    console.log("Database connection successful");
  }
  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Server starting listening on port ", PORT);
    });
  }
};
