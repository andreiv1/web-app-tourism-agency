const { fakerRO: faker } = require("@faker-js/faker");
const { hashPassword } = require("../utils/password");

const generalPassword = "parola"

async function generateUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = await hashPassword(generalPassword);
  const phoneNumber = `+4${faker.phone.number()}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const birthDate = new Date(faker.date.past({
    years: 50,
    refDate: "2002-01-01T00:00:00.000Z",
  }));
  const type = "tourist";
  const dateAdded = faker.date.past({
    years: 2,
    refDate: "2021-01-01T00:00:00.000Z",
  });
  const gender = faker.person.sex() === 'female' ? 'F' : 'M';
  return {
    firstName,
    lastName,
    password,
    phoneNumber,
    email,
    birthDate,
    gender,
    type,
    dateAdded,
  };
}

async function generateUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await generateUser();
    users.push(user);
  }
  return users;
}

module.exports = {
  generateUser,
  generateUsers,
}