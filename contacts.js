const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

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
// async function addContact(name, email, phone) {
//   try {
//     const contactsList = JSON.parse(
//       await fsPromises.readFile("./db/contacts.json", "utf-8")
//     );
//     const newContact = {
//       id: contactsList.length + 1,
//       name,
//       email,
//       phone,
//     };
//     const newList = [...contactsList, newContact];
//     await fsPromises.writeFile(contactsPath, JSON.stringify(newList), "utf-8");
//     console.table(newList);
//   } catch (err) {
//     throw err;
//   }
// }
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
