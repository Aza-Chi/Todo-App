const getUsers = "SELECT * FROM users";
const getUserById = "SELECT * FROM users WHERE id = $1";
const checkEmailExists = "SELECT u FROM users u WHERE u.email = $1";
const checkUsernameExists = "SELECT u FROM users u WHERE u.username = $1"; 
//
const addUser =
  "INSERT INTO users (username, password_hash, first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6)";
const removeUser = "DELETE FROM users WHERE id = $1";


const generateUserUpdateQuery = (column) => {
  return `UPDATE users SET ${column} = $1, updated_at = NOW() WHERE id = $2`;
};

module.exports = {
  getUsers,
  getUserById,
  checkEmailExists,
  checkUsernameExists,
  addUser,
  removeUser,
  generateUserUpdateQuery,
};