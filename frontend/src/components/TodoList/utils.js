export const fetchTodos = async (listId, setTodos, setError) => {
    try {
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