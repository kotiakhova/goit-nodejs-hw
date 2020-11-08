const { Router } = require("express");
const ContactController = require("./contact.controller");

const contactRouter = Router();

contactRouter.get("/", ContactController.listContacts);
contactRouter.get(
  "/:contactId",
  ContactController.validateId,
  ContactController.getById
);

contactRouter.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.addContact
);
contactRouter.patch(
  "/:contactId",
  ContactController.validateUpdateContact,
  ContactController.validateId,
  ContactController.updateContact
);
contactRouter.delete(
  "/:contactId",
  ContactController.validateId,
  ContactController.removeContact
);
module.exports = contactRouter;
