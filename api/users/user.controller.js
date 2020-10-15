const fs = require("fs");
const path = require("path");
const Joi = require("joi");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "/../../db/contacts.json");

class UserController {
  get listContacts() {
    return this._listContacts.bind(this);
  }
  get addContact() {
    return this._addContact.bind(this);
  }
  get updateContact() {
    return this._updateContact.bind(this);
  }
  get removeContact() {
    return this._removeContact.bind(this);
  }
  get getById() {
    return this._getById.bind(this);
  }
  async _listContacts(req, res, next) {
    try {
      return res.json(
        JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"))
      );
    } catch (err) {
      next(err);
    }
  }
  async _getById(req, res, next) {
    try {
      const contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = Number(req.params.contactId);
      const targetContactIndex = this.findContactIndexById(res, contacts, id);
      res.status(200).json(contacts[targetContactIndex]);
    } catch (err) {
      next(err);
    }
  }
  async _addContact(req, res, next) {
    try {
      const contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const newContact = {
        id: contacts[contacts.length - 1].id + 1,
        ...req.body,
      };
      contacts.push(newContact);
      await fsPromises.writeFile(
        contactsPath,
        JSON.stringify(contacts),
        "utf-8"
      );
      res.status(200).json(newContact);
    } catch (err) {
      next(err);
    }
  }
  async _updateContact(req, res, next) {
    try {
      const contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = Number(req.params.contactId);

      const targetContactIndex = this.findContactIndexById(res, contacts, id);

      contacts[targetContactIndex] = {
        ...contacts[targetContactIndex],
        ...req.body,
      };

      await fsPromises.writeFile(
        contactsPath,
        JSON.stringify(contacts),
        "utf-8"
      );
      return res.status(200).json(contacts[targetContactIndex]);
    } catch (err) {
      next(err);
    }
  }
  async _removeContact(req, res, next) {
    try {
      const contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = Number(req.params.contactId);

      const targetContactIndex = this.findContactIndexById(res, contacts, id);

      contacts.splice(targetContactIndex, 1);
      await fsPromises.writeFile(
        contactsPath,
        JSON.stringify(contacts),
        "utf-8"
      );
      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  validateCreateContact(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const result = createUserRules.validate(req.body);

    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }
  validateUpdateContact(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const result = createUserRules.validate(req.body);

    if (result.error) {
      return res.status(400).json({ message: "missing fields" });
    }
    next();
  }
  findContactIndexById(res, contacts, id) {
    const targetContactIndex = contacts.findIndex(contact => contact.id === id);
    if (targetContactIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }
    return targetContactIndex;
  }
}
module.exports = new UserController();
