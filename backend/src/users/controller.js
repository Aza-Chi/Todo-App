const pool = require("../../db");
const queries = require("./queries");

/*///// get all users /////*/
const getUsers = (req, res) => {
  console.log(`getUsers attempted`);
  pool.query(queries.getUsers, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};


/*///// Get User By Email /////*/
const getUserByEmail = (req, res) => {
    console.log(`getUserByEmail attemped`);
    pool.query(queries.getUsers, (error, results) => {
      if (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results.rows);
      }
    });
  };

/*////// add user /////*/
const addUser = async (req, res) => {
  const { username, email, hashedPassword, name } = req.body;
console.log(`users/controller - addUser username:${username}, email: ${email},hashpass: ${hashedPassword}, name: ${name} `);
  try {
    // Check if email exists
    const emailExistsResult = await pool.query(queries.checkEmailExists, [
      email,
    ]);
    if (emailExistsResult.rows.length > 0) {
      console.log("This email address is already in use.");
      return res.send("This email address is already in use.");
    }

    // Add the user
    await pool.query(queries.addUser, [username, email, hashedPassword, name]);
    console.log("Added the User!");
    return res.send("User Added Successfully!");
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).send("Error adding user.");
  }
};

//get user by id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(200).json(results.rows);
      }
    }
  });
};

/*/////remove user /////*/
const removeUser = (req, res) => {
  const id = parseInt(req.params.id);

  // Check if the user exists before attempting removal
  pool.query(queries.getUserById, [id], (error, results) => {
    if (error) {
      console.error("Error checking if user exists:", error);
      return res.status(500).send("Error checking if user exists.");
    }

    // If no user is found with the given ID, return a 404 response
    if (results.rows.length === 0) {
      return res.status(404).send("User does not exist in database!");
    }

    // Remove the user
    pool.query(queries.removeUser, [id], (error, results) => {
      if (error) {
        console.error("Error removing user:", error);
        return res.status(500).send("Error removing user.");
      }
      res.status(200).send("User Successfully Removed");
    });
  });
};

/*///// Update User /////*/
const updateUserColumn = async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password, name, email } = req.body;
/*
hash password here
FILLER
*/
const hashedPassword = password;
/*
*/
  try {
    // Check if the user exists before attempting to update
    const result = await pool.query(queries.getUserById, [id]);

    // If no user is found with the given ID, return a 404 response
    if (result.rows.length === 0) {
      return res.status(404).send("User does not exist in database!");
    }

    // Update the user columns based on the request body - Note: For password need to encrypt it again
    const updates = [
      { column: "username", value: username },
      { column: "hashed_password", value: hashedPassword },
      { column: "name", value: name },
      { column: "email", value: email },
    ];

    for (const update of updates) {
      if (update.value !== undefined) {
        const updateQuery = queries.generateUserUpdateQuery(update.column); // Generate update query for the column
        await updateColumn(updateQuery, update.value, id); // Update the column
      }
    }

    res.status(200).send("Columns updated successfully");
  } catch (error) {
    console.error("Error updating columns:", error);
    res.status(500).send("Error updating columns.");
  }
};

// Function to update a specific column
const updateColumn = async (updateQuery, value, id) => {
  try {
    await pool.query(updateQuery, [value, id]);
    console.log(`Column updated successfully`);
  } catch (error) {
    console.error(`Error updating column:`, error);
    throw error;
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  removeUser,
  updateUserColumn,
};
