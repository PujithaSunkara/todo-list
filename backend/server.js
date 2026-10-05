const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(
    "mongodb://127.0.0.1:27017/todo"
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
  });

const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);


app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error getting tasks",
    });
  }
});


app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task({
      task: req.body.task,
      completed: false,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error adding task",
    });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error updating task",
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error deleting task",
    });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});