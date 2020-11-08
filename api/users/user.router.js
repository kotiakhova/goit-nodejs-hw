const { Router } = require("express");
const UserController = require("./user.controller");

const userRouter = Router();
userRouter.get(
  "/users/current",
  UserController.authorize,
  UserController.getCurrentUser
);

userRouter.post(
  "/auth/register",
  UserController.validateUser,
  UserController.registration
);
userRouter.put(
  "/auth/login",
  UserController.validateUser,
  UserController.login
);
userRouter.patch(
  "/users",
  UserController.authorize,
  UserController.updateUserSubscription
);
userRouter.patch(
  "/auth/logout",
  UserController.authorize,
  UserController.logout
);
module.exports = userRouter;
