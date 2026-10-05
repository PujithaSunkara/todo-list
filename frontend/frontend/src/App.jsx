import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // ==========================
  // GET TASKS
  // ==========================
  const getTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/tasks"
      );

      setTasks(response.data);
    } catch (error) {
      console.log("Error getting tasks:", error);
    }
  };

  // Run when page loads
  useEffect(() => {
    getTasks();
  }, []);

  // ==========================
  // ADD TASK
  // ==========================
  const addTask = async () => {
    if (task.trim() === "") {
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/tasks",
        {
          task: task,
        }
      );

      setTask("");

      getTasks();
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  // ==========================
  // COMPLETE / INCOMPLETE
  // ==========================
  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {
          completed: !completed,
        }
      );

      getTasks();
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  // ==========================
  // DELETE TASK
  // ==========================
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/tasks/${id}`
      );

      getTasks();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>

      <div className="inputBox">
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <button onClick={addTask}>
          Add
        </button>
      </div>

      <div className="taskList">
        {tasks.map((item) => (
          <div
            className={`task ${
              item.completed ? "completed" : ""
            }`}
            key={item._id}
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() =>
                toggleComplete(
                  item._id,
                  item.completed
                )
              }
            />

            <span>{item.task}</span>

            <button
              className="deleteBtn"
              onClick={() =>
                deleteTask(item._id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;