import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Todo from "../Todo/Todo";
import PropTypes from "prop-types";
import styles from "./TodoList.module.css";
import { fetchTodos, updateListName, updateOrderNum } from "./utils";

function TodoList({ todoList, authData, onRemove }) {
  const navigate = useNavigate();
  const padOrderNum = (num) => {
    return num.toString().padStart(1, "0");
  };

  const [todos, setTodos] = useState([]);
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [error, setError] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newListName, setNewListName] = useState(todoList.list_name);
  const [isEditingOrderNum, setIsEditingOrderNum] = useState(false);
  const [newOrderNum, setNewOrderNum] = useState(
    todoList.order_num !== null ? padOrderNum(todoList.order_num) : "0"
  );

  useEffect(() => {
    fetchTodos(todoList.list_id, setTodos, setError);
  }, [todoList]);

  const handleInputChange = (event) => {
    setNewTodoDescription(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/todos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            list_id: todoList.list_id,
            description: newTodoDescription,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      fetchTodos(todoList.list_id, setTodos, setError);
      setNewTodoDescription("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } 
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.todo_id !== todoId)
    );
  };

  const handleRemoveTodoList = async () => {
    if (
      window.confirm("This will remove this Todo List, do you wish to proceed?")
    ) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/lists/list/${todoList.list_id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (response.ok) {
          onRemove(todoList.list_id);
        } else {
          console.error("Error removing todo list");
        }
      } catch (error) {
        console.error("Error removing todo list:", error);
      } finally {
        navigate(0);
      }
    }
  };

  const handleListNameChange = (event) => {
    setNewListName(event.target.value);
  };

  const handleListNameSubmit = async (event) => {
    if (event.key === "Enter") {
      try {
        const updatedList = await updateListName(todoList.list_id, newListName);
        setNewListName(updatedList.list_name);
      } catch (error) {
        console.error("Error updating list name:", error);
      }
      setIsEditingName(false);
    }
  };

  const handleOrderNumClick = () => {
    setIsEditingOrderNum(true); // Enable editing when order num is clicked
  };

  const handleOrderNumChange = (event) => {
    const { value } = event.target;
    // Restrict input to 3 digits
    if (/^\d{0,2}$/.test(value)) {
      setNewOrderNum(value);
      
    }
  };

  const handleOrderNumSubmit = async (event) => {
    
    if (event.key === "Enter") {
      const orderNum = parseInt(newOrderNum);
      console.log(`TodoList - attempting ordernewsubmit `);
      if (!isNaN(orderNum) && newOrderNum.length <= 2) {
        try {
          const response = await updateOrderNum(todoList.list_id, orderNum);
          setNewOrderNum(padOrderNum(response.order_num));
          
        } catch (error) {
          console.error("Error updating order number:", error);
        } finally {
          navigate(0);
        }
      } else {
        console.error("Invalid order number format");
      }
      setIsEditingOrderNum(false);
    }
    
  };

  const renderTodos = () => {
    return todos.map((todo) => (
      <React.Fragment key={todo.todo_id}>
        <Todo todo={todo} authData={authData} onDelete={handleDeleteTodo} />
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.todoList}>
      <div className={styles.header}>
        {/* Editable Order Number */}
        <div className={styles.orderNum}>
          {isEditingOrderNum ? (
            <input
              type="text"
              value={newOrderNum}
              onChange={handleOrderNumChange}
              onKeyDown={handleOrderNumSubmit}
              onBlur={() => setIsEditingOrderNum(false)}
              autoFocus
            />
          ) : (
            <h2 onClick={handleOrderNumClick}>#{newOrderNum}</h2>
          )}
        </div>
        {/* Editable List Name */}
        {isEditingName ? (
          <input
            type="text"
            value={newListName}
            onChange={handleListNameChange}
            onKeyDown={handleListNameSubmit}
            onBlur={() => setIsEditingName(false)}
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditingName(true)}>{newListName}</h2>
        )}

        {/* Remove Todo List Button */}
        <button
          onClick={handleRemoveTodoList}
          className={styles.removeButton}
          title="Remove Todo List"
        >
          X
        </button>
      </div>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>Error: {error.message}</p>}

      {/* Render Todos or Message if None */}
      {todos.length === 0 ? <p>No todos added yet.</p> : renderTodos()}

      {/* Add Todo Input */}
      <div className={styles.addTodo}>
        <input
          type="text"
          placeholder=""
          value={newTodoDescription}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
}

TodoList.propTypes = {
  todoList: PropTypes.object.isRequired,
  authData: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default TodoList;
