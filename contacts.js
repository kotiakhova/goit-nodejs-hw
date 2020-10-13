const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    console.table(JSON.parse(await fsPromises.readFile(contactsPath, "utf-8")));
  } catch {
    throw err;
  }
}
async function getContactById(contactId) {
  try {
    console.table(
      JSON.parse(await fsPromises.readFile(contactsPath, "utf-8")).find(
        contact => contact.id === contactId
      )
    );
  } catch {
    throw err;
  }
}

async function removeContact(contactId) {
  try {
    const newcContacts = JSON.parse(
      await fsPromises.readFile(contactsPath, "utf-8")
    ).filter(contact => contact.id != contactId);

    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(newcContacts),
      "utf-8"
    );
    console.table(JSON.parse(await fsPromises.readFile(contactsPath, "utf-8")));
  } catch {
    throw err;
  }
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
