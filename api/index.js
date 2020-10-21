const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactRouter = require("./contacts/contact.router");
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
  }
  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }
  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log("Server starting listening on port ", PORT);
    });
  }
};
