const crypto = require("crypto");

const hashImage = (imageBuffer) => {
  return crypto.createHash("md5").update(imageBuffer).digest("hex");
};

module.exports = {
  hashImage,
};
