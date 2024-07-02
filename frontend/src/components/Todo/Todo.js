import React, { useState } from 'react';
import styles from './Todo.module.css';

function Todo({ todo, authData, onDelete }) {
  const [currentTodo, setCurrentTodo] = useState(todo);

  const handleToggleComplete = async (event) => {
    const completed = event.target.checked;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${currentTodo.todo_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: completed,
          list_id: currentTodo.list_id,
        }),
      });

      if (response.ok) {
        const updatedTodo = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${currentTodo.todo_id}`);
        if (updatedTodo.ok) {
          const updatedTodoData = await updatedTodo.json();
          setCurrentTodo(updatedTodoData);
        }
      } else {
        console.error('Error updating todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(`attempting to remove todo id: ${currentTodo.todo_id}`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${currentTodo.todo_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        onDelete(currentTodo.todo_id);
      } else {
        console.error('Error deleting todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className={styles.todo}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={currentTodo.completed}
          onChange={handleToggleComplete}
          className={styles.checkbox}
        />
        <label className={styles.checkboxLabel}></label>
      </div>
      <div className={currentTodo.completed ? styles.completed : ''}>
        <h3>{currentTodo.title}</h3>
        <p>{currentTodo.description}</p>
      </div>
      <button title="Remove Todo" onClick={handleDelete} className={styles.deleteButton}>
        X
      </button>
    </div>
  );
}

export default Todo;
