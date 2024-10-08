const isAdmin = (req, res, next) => {
  if (req.session && req.session.userData && req.session.userData) {
    if (req.session.userData.type === "admin") {
      return next();
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = isAdmin;
