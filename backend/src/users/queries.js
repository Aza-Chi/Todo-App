const getUsers = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id = $1";
const getUserByEmail = "SELECT user_id, username, email, name, hashed_password, created_at, updated_at FROM users WHERE email = $1";
const checkEmailExists = "SELECT u FROM users u WHERE u.email = $1";
const checkUsernameExists = "SELECT u FROM users u WHERE u.username = $1";
const addUser =
  "INSERT INTO users (username, email, hashed_password, name) VALUES ($1, $2, $3, $4)";
//
// const add3rdPartyUser =
//   "INSERT INTO users (username, email, name) VALUES ($1, $2, $3 )";
const removeUser = "DELETE FROM users WHERE id = $1";

const generateUserUpdateQuery = (column) => {
  return `UPDATE users SET ${column} = $1, updated_at = NOW() WHERE id = $2`;
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  checkEmailExists,
  checkUsernameExists,
  addUser,
  removeUser,
  generateUserUpdateQuery,
};
