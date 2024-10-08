const isAuth = (req, res, next) => {
  if (req.session && req.session.userData && req.session.userData.id) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = isAuth;
