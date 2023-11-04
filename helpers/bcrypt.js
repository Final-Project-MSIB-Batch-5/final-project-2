const bcrypt = require("bcryptjs");

const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const hashPassword = (plainPassword) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(plainPassword, salt);

  return hash;
};

module.exports = {
  comparePassword,
  hashPassword,
};
