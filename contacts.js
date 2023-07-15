const fs = require("fs/promises");
const path = require("path");

const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");


async function listContacts() {
  const data = JSON.parse(await fs.readFile(contactsPath, "utf-8"));

  return data;
}

async function getContactById(contactId) {
  const contactsArr = await listContacts();
  const findedObj = contactsArr.filter((obj) => obj.id === contactId);

  return findedObj[0] ? findedObj[0] : null;
}

async function removeContact(contactId) {
  const contactsArr = await listContacts();
  let deletedContact = null;
  const newContactArr = [];

  for (const contact of contactsArr) {
    if (contact.id === contactId) {
      deletedContact = contact;
      continue;
    }
    newContactArr.push(contact);
  }

  deletedContact && fs.writeFile(contactsPath, JSON.stringify(newContactArr, null, 2));

  return deletedContact;
}

async function addContact(name, email, phone) {
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const contactsArr = await listContacts();
  const isOlredyExist = Boolean(
    contactsArr.find((contact) => contact.email === email)
  );

  if (!isOlredyExist) {
    contactsArr.push(newContact);

    fs.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));

    return newContact;
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
