import React from 'react';
import styles from './Todo.module.css';

function Todo({ todo, authData, onDelete }) {
  const handleToggleComplete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${todo.todo_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (response.ok) {
        // Handle successful update (e.g., refetch todos or update state)
      } else {
        console.error('Error updating todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(`attempting to remove todo id: ${todo.todo_id}`);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/${todo.todo_id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      if (response.ok) {
        onDelete(todo.todo_id);
      } else {
        console.error('Error deleting todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className={styles.todo}>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <button onClick={handleToggleComplete}>
        {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
      </button>
      <button onClick={handleDelete} className={styles.deleteButton}>
        Remove
      </button>
    </div>
  );
}

export default Todo;
