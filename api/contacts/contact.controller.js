const Joi = require("joi");
const contactModel = require("./contact.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class ContactController {
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
      const { page, sub, limit } = req.query;
      const options = {
        page: page ? page : 1,
        limit: limit ? limit : 5,
      };
      return res.json(
        await contactModel.paginate(
          sub ? { subscription: sub } : {},
          options,
          (err, result) => result.docs
        )
      );
    } catch (err) {
      next(err);
    }
  }
  async _getById(req, res, next) {
    try {
      const contactId = req.params.contactId;

      const contact = await contactModel.findById(contactId);
      if (!contact) {
        return res.status(404).send();
      }
      res.json(contact);
    } catch (err) {
      next(err);
    }
  }
  async _addContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }
  async _updateContact(req, res, next) {
    try {
      const contactId = req.params.contactId;
      const contactToUpDate = await contactModel.findContactByIdAndUpdate(
        contactId,
        req.body
      );
      if (!contactToUpDate) {
        return res.status(404).send();
      }
      return res.status(204).json(contactToUpDate);
    } catch (err) {
      next(err);
    }
  }
  async _removeContact(req, res, next) {
    try {
      const contactId = req.params.contactId;

      const removedContact = await contactModel.findOneAndDelete(contactId);
      if (!removedContact) {
        return res.status(404).send();
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { contactId } = req.params;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send();
    }
    next();
  }

  validateCreateContact(req, res, next) {
    const createRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string(),
      password: Joi.string().required(),
    });

    const result = createRules.validate(req.body);

    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }
  validateUpdateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      return res.status(400).json({ message: "missing fields" });
    }
    next();
  }
}
module.exports = new ContactController();
