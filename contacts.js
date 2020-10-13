const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    const contact = JSON.parse(data).find(contact => contact.id === contactId);
    console.log(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    const newcContacts = JSON.parse(data).filter(
      contact => contact.id != contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(newcContacts), err => {
      if (err) console.log(err);
    });
  });
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    console.table(JSON.parse(data));
  });
}

async function addContact(name, email, phone) {
  try {
    const contacts = JSON.parse(
      await fsPromises.readFile(contactsPath, "utf-8")
    );

    const newContact = {
      id: contacts[contacts.length - 1].id + 1,
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts), "utf-8");
    console.table(contacts);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts: () => listContacts(),
  getContactById: id => getContactById(id),
  removeContact: id => removeContact(id),
  addContact: (name, email, phone) => addContact(name, email, phone),
};
