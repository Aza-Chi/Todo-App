const getTodoLists = "SELECT * FROM todo_lists";
//
const getTodoListByListId = "SELECT * FROM todo_lists WHERE list_id = $1";
const getTodoListByEmail = "SELECT * FROM todo_lists WHERE email = $1";
const getTodoListByUserId = "SELECT * FROM todo_lists WHERE owner_id = $1";
const addTodoList =
  "INSERT INTO todo_lists (owner_id, list_name) VALUES ($1, $2)";

const removeTodoListByListId = "DELETE FROM todo_lists WHERE list_id = $1";
const updateToDoList = `UPDATE todo_lists 
SET 
    list_name = COALESCE($1, list_name), 
    order_num = COALESCE($2, order_num), 
    updated_at = NOW() 
WHERE list_id = $3;`;

module.exports = {
  getTodoLists,
  getTodoListByListId,
  getTodoListByEmail,
  getTodoListByUserId,
  addTodoList,
  removeTodoListByListId,
  updateToDoList: updateToDoList,
};
