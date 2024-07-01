import React, { createContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export const TodoProvider = ({ children, authData }) => {
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    if (authData) {
      fetchTodoLists();
    }
  }, [authData]);

  const fetchTodoLists = async () => {
    const response = await fetch('/api/todo_lists', {
      headers: {
        'Authorization': `Bearer ${authData.id}` // Assuming authData.id is the token or user id
      }
    });
    const data = await response.json();
    setTodoLists(data);
  };

  const fetchTodos = async (listId) => {
    const response = await fetch(`/api/todo_lists/${listId}/todos`, {
      headers: {
        'Authorization': `Bearer ${authData.id}`
      }
    });
    const data = await response.json();
    return data;
  };

  const addTodo = async (listId, description) => {
    const response = await fetch(`/api/todo_lists/${listId}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id}`
      },
      body: JSON.stringify({ description })
    });
    const newTodo = await response.json();
    return newTodo;
  };

  const updateTodoStatus = async (todoId, status) => {
    await fetch(`/api/todos/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.id}`
      },
      body: JSON.stringify({ status })
    });
  };

  return (
    <TodoContext.Provider value={{ todoLists, fetchTodos, addTodo, updateTodoStatus }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
