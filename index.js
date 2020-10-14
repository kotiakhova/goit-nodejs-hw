const exportContactsFunction = require("./contacts");
const yargs = require("yargs");

const argv = yargs
  .string("action")
  .number("id")
  .string("name")
  .string("email")
  .string("phone").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      exportContactsFunction.listContacts();
      break;

    case "get":
      exportContactsFunction.getContactById(id);
      break;

    case "add":
      exportContactsFunction.addContact(name, email, phone);
      break;

    case "remove":
      exportContactsFunction.removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
