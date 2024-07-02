const pool = require("../../db.js");
const queries = require("./queries.js");

/* Get all todos */
const getTodos = (req, res) => {
  pool.query(queries.getTodos, (error, results) => {
    if (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};

/* Get todo by list ID */
const getTodoByListId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getTodoByListId, [id], (error, results) => {
    if (error) {
      console.error("Error fetching todo by list ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: "Todo list not found" });
    } else {
      res.status(200).json(results.rows);
    }
  });
};

/* Get todo by todo ID */
const getTodoByTodoId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getTodoByTodoId, [id], (error, results) => {
    if (error) {
      console.error("Error fetching todo by todo ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.rows.length === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json(results.rows[0]);
    }
  });
};

/* Add new todo */
const addTodo = (req, res) => {
    const { list_id, description, completed = false, priority = null, status = null, deadline = null, reminder = null } = req.body;
    
    if (!list_id || !description) {
      return res.status(400).json({ error: "List ID and description are required" });
    }
    
    pool.query(
      queries.addTodo,
      [list_id, description, completed, priority, status, deadline, reminder],
      (error, results) => {
        if (error) {
          console.error("Error adding new todo:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json(results.rows[0]);
        }
      }
    );
  };


/* Update todo by todo ID */
const updateTodoByTodoId = (req, res) => {
    const id = parseInt(req.params.id);
    const { list_id, description, completed, priority, status, deadline, reminder } = req.body;
  
    if (!list_id ) {
      console.log(`todos/controller.js - List ID required`);
      return res.status(400).json({ error: "List ID required" });
    }
  
    pool.query(
      queries.updateTodoByTodoId,
      [list_id, description, completed, priority, status, deadline, reminder, id],
      (error, results) => {
        if (error) {
          console.error("Error updating todo by todo ID:", error);
          res.status(500).json({ error: "Internal Server Error" });
        } else if (results.rows.length === 0) {
          res.status(404).json({ error: "Todo not found" });
        } else {
          res.status(200).json(results.rows[0]);
        }
      }
    );
  };
  
/* Remove todo by todo ID */
const removeTodoByTodoId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.removeTodoByTodoId, [id], (error, results) => {
    if (error) {
      console.error("Error deleting todo by todo ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).send("Todo deleted successfully");
    }
  });
};

/* Remove todo by list ID */
const removeTodoByListId = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.removeTodoByListId, [id], (error, results) => {
    if (error) {
      console.error("Error deleting todos by list ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).send("Todos deleted successfully");
    }
  });
};

module.exports = {
  getTodos,
  getTodoByListId,
  getTodoByTodoId,
  addTodo,
  updateTodoByTodoId,
  removeTodoByTodoId,
  removeTodoByListId,
};