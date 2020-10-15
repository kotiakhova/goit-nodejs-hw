const { Router } = require("express");
const UserController = require("./user.controller");

const userRouter = Router();

userRouter.get("/", UserController.listContacts);
userRouter.get("/:contactId", UserController.getById);
userRouter.post(
  "/",
  UserController.validateCreateContact,
  UserController.addContact
);
userRouter.patch(
  "/:contactId",
  UserController.validateUpdateContact,
  UserController.updateContact
);
userRouter.delete("/:contactId", UserController.removeContact);
module.exports = userRouter;
