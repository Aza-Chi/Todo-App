const getTodos = "SELECT * FROM todos";
const getTodoByListId = "SELECT * FROM todos WHERE list_id = $1";
const getTodoByTodoId = "SELECT * FROM todos WHERE todo_id = $1";
const addTodo = `
  INSERT INTO todos (list_id, description, completed, priority, status, deadline, reminder) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING *`;
  const updateTodoByTodoId = `
  UPDATE todos SET list_id = COALESCE($1, list_id), 
  description = COALESCE($2, description), 
  completed = COALESCE($3, completed), 
  priority = COALESCE($4, priority), 
  status = COALESCE($5, status), 
  deadline = COALESCE($6, deadline), 
  reminder = COALESCE($7, reminder), 
  updated_at = NOW() 
  WHERE todo_id = $8 
  RETURNING *;`


const removeTodoByTodoId = "DELETE FROM todos WHERE todo_id = $1";
const removeTodoByListId = "DELETE FROM todos WHERE list_id = $1";

module.exports = {
getTodos,
getTodoByListId,
getTodoByTodoId,
addTodo,
updateTodoByTodoId,
removeTodoByListId,
removeTodoByTodoId,
};

/*
const getTodosByStatus = "SELECT * FROM todos WHERE status = $1";
const getTodosByPriority = "SELECT * FROM todos WHERE priority = $1";
const getOverdueTodos = "SELECT * FROM todos WHERE deadline < NOW() AND completed = FALSE";
*/

// router.get("/", controller.getTodos);
// router.get("/todo/:id", controller.getTodosByTodoId);
// router.get("/user/:id", controller.getTodosByListId);
// router.post("/", controller.addTodo);
// router.put("/todo/:id", controller.updateTodos);
// router.delete("/todo/:id", controller.removeTodoListByTodoId);
