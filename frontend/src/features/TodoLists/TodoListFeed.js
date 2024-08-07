import React, { useState, useEffect } from 'react';
import TodoList from '../../components/TodoList/TodoList';
import { useNavigate } from 'react-router-dom';
import { useLoaderData } from "react-router-dom";
import styles from "./TodoListFeed.module.css";
import { getStatus } from '../auth/utils';
import InlineLink from "../../components/InlineLink/InlineLink";

export async function todoListFeedLoader() {
  const authData = await getStatus();
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

      // Navigate to refresh the page
      navigate(0);

    } catch (error) {
      console.error('Error adding todo list:', error);
    }
  };

  function renderFeedItems() {
    // Sort todoListData by order_num
    const sortedTodoListData = [...todoListData].sort((a, b) => a.order_num - b.order_num);

    if (loading) {
      return <p className={styles.loadingMessage}>Loading...</p>;
    }
  
    if (error) {
      return <p className={styles.errorMessage}>Error: {error.message}</p>;
    }
  
    if (!sortedTodoListData || sortedTodoListData.length === 0) {
      return <p className={styles.emptyFeedMessage}>Please add a Todo list using the button above.</p>;
    }
  
    const feedItems = sortedTodoListData.map((todoList, index) => (
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

  if (!authData || !authData.logged_in) {
    return (
      <div className={styles.loginMessage}>
        <h3>Please <InlineLink path="/login" anchor="Log In" /> to use the Todo Lists App.</h3>    
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