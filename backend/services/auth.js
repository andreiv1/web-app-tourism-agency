const { db } = require("../utils/firebase");
const { hashPassword, checkPassword } = require("../utils/password");

const usersRef = db.collection("users");

async function login(credentials) {
  let data = {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null,
    type: null,
  };
  
  let query = null;

  if (credentials.email !== undefined) {
    query = await usersRef.where("email", "==", credentials.email).get();
  } else if (credentials.phoneNumber !== undefined) {
    query = await usersRef.where("phoneNumber", "==", credentials.phoneNumber).get();
  }

  if (!query || query.empty) {
    return data;
  }

  const user = query.docs[0].data();
  const isPasswordCorrect = await checkPassword(credentials.password, user.password);

  if (!isPasswordCorrect) {
    return data;
  }

  data.id = query.docs[0].id;
  data.firstName = user.firstName;
  data.lastName = user.lastName;
  data.email = user.email;
  data.phoneNumber = user.phoneNumber;
  data.type = user.type;

  return data;
}

async function register(user) {
  const hashedPassword = await hashPassword(user.password);
  const newUser = {
    ...user,
    password: hashedPassword,
    type: "tourist",
    dateAdded: new Date(),
  };

  const userRef = await usersRef.add(newUser);
  return userRef.id;
}

async function userExists(email, phoneNumber) {
  let emailExists = false;
  let phoneExists = false;

  if (email) {
    const queryByEmail = await usersRef.where("email", "==", email).get();

    if (!queryByEmail.empty) {
      emailExists = true;
    }
  }

  if (phoneNumber) {
    const queryByPhoneNumber = await usersRef
      .where("phoneNumber", "==", phoneNumber)
      .get();

    if (!queryByPhoneNumber.empty) {
      phoneExists = true;
    }
  }

  return emailExists || phoneExists;
}

async function userExistsById(id){
  const query = await usersRef.doc(id).get();
  return query.exists;
}

module.exports = {
  login,
  register,
  userExists,
  userExistsById,
};
