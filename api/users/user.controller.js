const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("./user.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const { UnauthorizedError } = require("../helpers/error.constructor");

class UserController {
  constructor() {
    this._costFactor = 5;
  }
  get registration() {
    return this._registration.bind(this);
  }
  get login() {
    return this._login.bind(this);
  }

  async _registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const user = await userModel.findUserByEmail(email);
      if (user) {
        return res.status(409).send("Email in use");
      }
      const newUser = await userModel.create({
        email,
        password: passwordHash,
        token: "",
      });
      return res.status(201).json({
        email: newUser.email,
        password: newUser.password,
      });
    } catch (err) {
      next(err);
    }
  }
  async _login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }
      const isPassworldValid = await bcryptjs.compare(password, user.password);
      if (!isPassworldValid) {
        return res.status(401).send("Email or password is wrong");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60 * 60,
      });
      await userModel.updateToken(user._id, token);
      return res.json({
        token,
        user: {
          email: user.email,
          password: user.password,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      const userFinded = await userModel.findById(user._id);

      if (!userFinded) {
        throw new UnauthorizedError("Not authorized");
      }
      await userModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async getCurrentUser(req, res, next) {
    try {
      const user = req.user;

      if (!user) {
        throw new UnauthorizedError("Not authorized");
      }

      return res.json({
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async updateUserSubscription(req, res, next) {
    try {
      const { _id } = req.user;
      const { sub } = req.query;
      if (!sub || (sub !== "free" && sub !== "pro" && sub !== "premium")) {
        return res.status(400).send("New subscription not found");
      }
      const userToUpDate = await userModel.findUserByIdAndUpdate(_id, {
        subscription: sub,
      });
      console.log(userToUpDate);

      return res.status(204).json(userToUpDate);
    } catch (err) {
      next(err);
    }
  }
  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("Not authorized"));
      }
      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError("Not authorized");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }
  validateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const result = createUserRules.validate(req.body);

    if (result.error) {
      return res
        .status(400)
        .json({ message: "Ошибка от Joi или другой валидационной библиотеки" });
    }
    next();
  }
}
module.exports = new UserController();
