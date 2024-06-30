const getTodoLists = "SELECT * FROM todo_lists";
//
const getTodoListByListId = "SELECT * FROM todo_lists WHERE list_id = $1";
const getTodoListByEmail = "SELECT * FROM todo_lists WHERE email = $1";
const getTodoListByUserId = "SELECT * FROM todo_lists WHERE owner_id = $1";
const addTodoList =
  "INSERT INTO todo_lists (owner_id, list_name) VALUES ($1, $2)";

const removeTodoListByListId = "DELETE FROM todo_lists WHERE list_id = $1";
const updateToDoListName = "UPDATE todo_lists SET list_name = $1, updated_at = NOW() WHERE list_id = $2";

module.exports = {
  getTodoLists,
  getTodoListByListId,
  getTodoListByEmail,
  getTodoListByUserId,
  addTodoList,
  removeTodoListByListId,
  updateToDoListName
};
