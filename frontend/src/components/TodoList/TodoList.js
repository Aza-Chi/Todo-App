import React, { useState, useEffect } from 'react';
import Todo from '../Todo/Todo';
import PropTypes from 'prop-types';
import styles from './TodoList.module.css';
import { fetchTodos } from './utils';

function TodoList({ todoList, authData, onRemove }) {
  const [todos, setTodos] = useState([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos(todoList.list_id, setTodos, setError);
  }, [todoList]);

  const handleInputChange = (event) => {
    setNewTodoDescription(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list_id: todoList.list_id,
          description: newTodoDescription,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      fetchTodos(todoList.list_id, setTodos, setError);
      setNewTodoDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = (todoId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.todo_id !== todoId));
  };

  const handleRemoveTodoList = async () => {
    if (window.confirm('This will remove this Todo List, do you wish to proceed?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lists/list/${todoList.list_id}`, {
          method: 'DELETE',
          credentials: "include",
        });
        if (response.ok) {
          onRemove(todoList.list_id);
        } else {
          console.error('Error removing todo list');
        }
      } catch (error) {
        console.error('Error removing todo list:', error);
      }
    }
  };

  const renderTodos = () => {
    return todos.map(todo => (
      <React.Fragment key={todo.todo_id}>
        <Todo todo={todo} authData={authData} onDelete={handleDeleteTodo} />
      </React.Fragment>
    ));
  };

  return (
    <div className={styles.todoList}>
      <div className={styles.header}>
        <h2>{todoList.list_name}</h2>
        <button
          onClick={handleRemoveTodoList}
          className={styles.removeButton}
          title="Remove Todo List"
        >
          X
        </button>
      </div>
      
      {error && <p className={styles.errorMessage}>Error: {error.message}</p>}

      {todos.length === 0 ? (
        <p>No todos added yet.</p>
      ) : (
        renderTodos()
      )}

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
  onRemove: PropTypes.func.isRequired,
};

export default TodoList;
