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
  const foundContact = contactsArr.find((contact) => contact.id === contactId);
  return foundContact || null;
}

async function removeContact(contactId) {
  const contactsArr = await listContacts();
  const deletedContact = contactsArr.find((contact) => contact.id === contactId);
  if (deletedContact) {
    const newContactArr = contactsArr.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContactArr, null, 2));
  }
  return deletedContact || null;
}

async function addContact(name, email, phone) {
  const contactsArr = await listContacts();
  const isAlreadyExist = contactsArr.some((contact) => contact.email === email);
  if (isAlreadyExist) {
    return null;
  }
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contactsArr.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
