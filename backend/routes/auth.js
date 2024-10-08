const express = require("express");
const router = express.Router();
const authService = require("../services/auth");
const { userRegisterSchema, userLoginSchema, userRegisterCheckSchema } = require("../schema/user");

const isAuth = require("../middleware/isAuth");

/**
 * AUTH ROUTES
 */

router.post("/login", async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const credentials = { email, phoneNumber, password };

  const validationResult = userLoginSchema.validate(credentials);
  if (validationResult.error) {
    return res.status(403).json({ message: validationResult.error.message });
  }
  const userData = await authService.login(credentials);
  if (userData.id) {
    req.session.userData = userData;
    return res.status(200).json({
      session: req.session.id,
      user: userData,
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/logout", isAuth, (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Logout successful" });
});

router.post("/register", async (req, res) => {
  if (req.session != undefined && req.session.userData != undefined) {
    const userData = req.session.userData;
    return res.status(403).json({ message: `User is logged in` });
  }
  const {
    birthDate,
    email,
    gender,
    firstName,
    lastName,
    password,
    phoneNumber,
  } = req.body;

  // check if user or the same email or phone number already exists
  const userExists = await authService.userExists(email, phoneNumber);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = {
    birthDate: new Date(birthDate),
    email,
    firstName,
    lastName,
    gender,
    password,
    phoneNumber,
  };

  const validationResult = userRegisterSchema.validate(user);
  if (validationResult.error) {
    return res.status(403).json({ message: validationResult.error.message });
  }

  const userId = await authService.register(user);

  if (userId) {
    return res.status(200).json({ message: "Register successful" });
  } else {
    return res.status(400).json({ message: "Register failed" });
  }
});

router.post("/check-session", async (req, res) => {
  if (req.session != undefined && req.session.userData != undefined) {
    const checkUser = await authService.userExistsById(req.session.userData.id);
    if(!checkUser){
      req.session.destroy();
      return res.status(401).json({ message: `Session destroyed.` });
    }
    return res.status(200).json({
      user: req.session.userData,
      session: req.session.id,
    });
  } else {
    return res.status(403).json({ message: `Session not started.` });
  }
});

router.post("/check-register", async (req, res) => {
  const credentials = req.body;
  const validationResult = userRegisterCheckSchema.validate(credentials);
  if (validationResult.error) {
    return res.status(400).json({ message: validationResult.error.message });
  }
  const userExists = await authService.userExists(credentials.email, credentials.phoneNumber);
  
  if (userExists) {
    return res.status(409).json({ message: "In use" });
  } else {
    return res.status(200).json({ message: "Available" });
  }
});


router.get("/profile", (req, res) => {
  return res.json({ message: "Profile", session: req.session });
});

module.exports = router;
