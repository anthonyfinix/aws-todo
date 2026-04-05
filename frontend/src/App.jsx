import { useState, useEffect } from 'react'

// The GitHub Action will swap this string during 'sam deploy'
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetching logic (DVA-C02: Asynchronous patterns)
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}todos`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Trigger on Mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app-container">
      <h1>Todo Frontend</h1>
      
      <div className="todo-box">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={() => {/* We'll add POST logic next */}}>Add</button>
      </div>

      <div className="todo-list">
        {loading ? (
          <p>Loading your tasks...</p>
        ) : todos.length > 0 ? (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} style={{ listStyle: 'none', padding: '10px', borderBottom: '1px solid #ddd' }}>
                <input type="checkbox" checked={todo.completed} readOnly />
                <span style={{ marginLeft: '10px' }}>{todo.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No todos found in DynamoDB.</p>
        )}
      </div>
    </div>
  )
}

export default App