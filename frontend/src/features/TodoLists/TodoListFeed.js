import React, { useState, useEffect } from 'react';
import TodoList from '../../components/TodoList/TodoList';
import { useNavigate } from 'react-router-dom';
import { useLoaderData } from "react-router-dom";
import styles from "./TodoListFeed.module.css";
import { getStatus } from '../auth/utils';

export async function todoListFeedLoader() {
  const authData = await getStatus();
  console.log(`TodoListFeed statusRes: ${authData}`);
  console.log(`TodoListFeed statusRes: ${authData.id}`);
  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lists/user/${authData.id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo lists');
  }
  const todoListData = await response.json();
  return { todoListData, authData };
}

function TodoListFeed() {
  const { todoListData: initialTodoListData, authData } = useLoaderData();
  const [todoListData, setTodoListData] = useState(initialTodoListData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodoLists = async () => {
      try {
        const { todoListData } = await todoListFeedLoader();
        setTodoListData(todoListData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching todo lists:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchTodoLists();
  }, []);

  const handleRemoveTodoList = (listId) => {
    setTodoListData((prevTodoListData) => prevTodoListData.filter((list) => list.list_id !== listId));
  };

  const handleAddTodoList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: authData.id,
          list_name: 'Todo List',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo list');
      }

      // Refetch the updated TodoList data
      const { todoListData } = await todoListFeedLoader();
      setTodoListData(todoListData);
    } catch (error) {
      console.error('Error adding todo list:', error);
    }
  };

  function renderFeedItems() {
    if (loading) {
      return <p className={styles.loadingMessage}>Loading...</p>;
    }
  
    if (error) {
      return <p className={styles.errorMessage}>Error: {error.message}</p>;
    }
  
    if (!todoListData || todoListData.length === 0) {
      return <p className={styles.emptyFeedMessage}>Please add a Todo list using the button above.</p>;
    }
  
    const feedItems = todoListData.map((todoList, index) => (
      <div className={styles.todoListItem} key={`${todoList.id}-${index}`}>
        <TodoList
          todoList={todoList}
          authData={authData}
          onRemove={handleRemoveTodoList}
        />
      </div>
    ));
  
    return (
      <div className={styles.todoListGrid}>
        {feedItems}
      </div>
    );
  }

  return (
    <div className={styles.todoListFeed}>
      <h1>Todo Lists</h1>
      <button onClick={handleAddTodoList} className={styles.addButton}>Add Todo List</button>
      {renderFeedItems()}
    </div>
  );
}

export default TodoListFeed;
