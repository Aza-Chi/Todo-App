const pool = require("../../db.js"); //
const queries = require("./queries.js");

/* Get all lists */
const getTodoLists = (req, res) => {
  console.log(`getTodoLists attempted`);
  pool.query(queries.getTodoLists, (error, results) => {
    if (error) {
      console.error("Error fetching Todo Lists:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};


/* Get list by user ID */
const getTodoListByOwnerId = (req, res) => {
  const owner_id =  parseInt(req.params.id);
  console.log(`getTodoListByOwnerId attempted for owner_id: ${owner_id}`);
  pool.query(queries.getTodoListByUserId, [owner_id], (error, results) => {
    if (error) {
      console.error("Error fetching Todo List by user ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};

/* Get list by list ID */
const getTodoListByListId = (req, res) => {
  
  const list_id =  parseInt(req.params.id);
  console.log(`getTodoListByListId attempted for listId: ${list_id}`);
  pool.query(queries.getTodoListByListId, [list_id], (error, results) => {
    if (error) {
      console.error("Error fetching Todo List by list ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};


/* Add list */
const addTodoList = async (req, res) => {
  const { owner_id, list_name } = req.body;
  console.log(`todolist/controller.js - addList owner_id:${owner_id}, list_name: ${list_name} `);
  try {
    await pool.query(queries.addTodoList, [owner_id, list_name]);
    console.log("Added the Todo List!");
    return res.status(201).send("Todo List Added Successfully!");
  } catch (error) {
    console.error("Error adding Todo List:", error);
    return res.status(500).send("Error adding Todo List.");
  }
};

/* Remove list */
const removeTodoListByListId = async (req, res) => {
  const list_id =  parseInt(req.params.id);
  console.log(`removeTodoListByListId attempted for listId: ${list_id}`);
  try {
    await pool.query(queries.removeTodoListByListId, [list_id]);
    console.log("Removed the Todo List!");
    return res.status(200).send("Todo List Removed Successfully!");
  } catch (error) {
    console.error("Error removing Todo List:", error);
    return res.status(500).send("Error removing Todo List.");
  }
};

/* Update list by list id */
const updateTodoList = async (req, res) => {
  const listId = parseInt(req.params.id);
  const { list_name, order_num } = req.body;
  console.log(`updateTodoList attempted for listId: ${listId}, list_name: ${list_name}, order_num: ${order_num}`);
  
  try {
    await pool.query(queries.updateToDoList, [list_name, order_num, listId]);
    console.log("Updated the Todo List!");
    return res.status(200).send("Todo List updated successfully!");
  } catch (error) {
    console.error("Error updating Todo List:", error);
    return res.status(500).send("Error updating Todo List.");
  }
};




/*///// Middleware /////*/

// Middleware to check if the user is the owner of the todo list
const checkOwner = async (req, res, next) => {
    const userId = req.user.id; 
    const listId = req.params.listId;
  console.log(`todolist middleware checkowner - req.user.id: ${userId}, req.params.listId: ${listId}`);
    const list = await pool.query('SELECT owner_id FROM todo_lists WHERE list_id = $1', [listId]);
    if (list.rows.length && list.rows[0].owner_id === userId) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
  
  // Middleware to check if the user has write permissions on the todo list
  const checkWritePermission = async (req, res, next) => {
    const userEmail = req.user.email; 
    const listId = req.params.listId;
  
    const shared = await pool.query('SELECT permission FROM shared_todos WHERE list_id = $1 AND email = $2', [listId, userEmail]);
    if (shared.rows.length && shared.rows[0].permission === 'write') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };

  
  module.exports = {
    getTodoLists,
    getTodoListByListId,
    getTodoListByUserId: getTodoListByOwnerId,
    removeTodoListByListId,
    updateTodoList,
    addTodoList,
    checkOwner,
    checkWritePermission,
  };
  
