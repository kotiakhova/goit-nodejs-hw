const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

// TODO: задокументировать каждую функцию
function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(contact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    const newcContacts = JSON.parse(data).filter(
      (contact) => contact.id != contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(newcContacts), (err) => {
      if (err) console.log(err);
    });
  });
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    console.table(JSON.parse(data));
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    const contacts = JSON.parse(data);

    const newContact = {
      id: contacts[contacts.length - 1].id + 1,
      name,
      email,
      phone,
    };
    setTimeout(() => {
      contacts.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(contacts), (err) => {
        if (err) console.log(err);
      });
      console.table(contacts);
    }, 1500);
  });
}

// listContacts();

// getContactById(2);

// removeContact(11);

// addContact("Diana", "diana@gmail.com", "098-768-65-77");

module.exports = {
  listContacts: () => listContacts(),
  getContactById: (id) => getContactById(id),
  removeContact: (id) => removeContact(id),
  addContact: (name, email, phone) => addContact(name, email, phone),
};
