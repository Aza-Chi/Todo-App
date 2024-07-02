export const fetchTodos = async (listId, setTodos, setError) => {
    try {
      const a = `${process.env.REACT_APP_API_BASE_URL}/todos/list/${listId}`;
      console.log(`utils.js - fetching Todos with listId:`, a);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/todos/list/${listId}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No todos found for list:', listId);
          setTodos([]);
        } else {
          throw new Error('Failed to fetch todos');
        }
      } else {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError(error);
    }
  };

// 
export async function updateListName(listId, newName) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lists/list/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        list_name: newName,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update list name');
    }
    const updatedList = await response.json();
    return updatedList;
  } catch (error) {
    throw new Error(`Error updating list name: ${error.message}`);
  }
}



export async function updateOrderNum(listId, newOrderNum) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/lists/list/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_num: newOrderNum,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update order number');
    }
    const updatedList = await response.json();
    return updatedList;
  } catch (error) {
    throw new Error(`Error updating order number: ${error.message}`);
  }
}
