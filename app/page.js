"use client"
import React, { useState, useEffect } from 'react'

const page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [mainTask, setMainTask] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setMainTask(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault();
    const newTask = { title, desc, priority, completed: false };
    if (editIndex !== null) {
      const updatedTasks = [...mainTask];
      updatedTasks[editIndex] = newTask;
      setMainTask(updatedTasks);
      setEditIndex(null);
    } else {
      setMainTask([...mainTask, newTask]);
    }
    setTitle("");
    setDesc("");
    setPriority("Low");
  };

  const deleteHandler = (i) => {
    const updatedTasks = mainTask.filter((_, index) => index !== i);
    setMainTask(updatedTasks);
  };

  const completeHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks[i].completed = !updatedTasks[i].completed;
    setMainTask(updatedTasks);
  };

  const editHandler = (i) => {
    const taskToEdit = mainTask[i];
    setTitle(taskToEdit.title);
    setDesc(taskToEdit.desc);
    setPriority(taskToEdit.priority);
    setEditIndex(i);
  };

  const filterTasks = (tasks, filter) => {
    if (filter === "Completed") {
      return tasks.filter(task => task.completed);
    } else if (filter === "Pending") {
      return tasks.filter(task => !task.completed);
    }
    return tasks;
  };

  let renderTask = <h2>No Task Available</h2>;

  const filteredTasks = filterTasks(mainTask, filter);

  if (filteredTasks.length > 0) {
    renderTask = filteredTasks.map((t, i) => {
      return (
        <li key={i} className={`flex items-center justify-between mb-8 ${t.completed ? 'line-through' : ''}`}>
          <div className='flex justify-between mb-5 w-2/3'>
            <h5 className='text-2xl font-semibold'>{t.title}</h5>
            <h6 className='text-lg font-medium'>{t.desc}</h6>
            <p className='text-sm font-medium'>Priority: {t.priority}</p>
          </div>
          <div>
            <button
              onClick={() => completeHandler(i)}
              className={`mr-2 px-4 py-2 rounded font-bold ${t.completed ? 'bg-green-400' : 'bg-gray-400'} text-white`}
            >
              {t.completed ? 'Undo' : 'Complete'}
            </button>
            <button
              onClick={() => editHandler(i)}
              className='bg-blue-400 text-white px-4 py-2 rounded font-bold mr-2'
            >
              Edit
            </button>
            <button
              onClick={() => deleteHandler(i)}
              className='bg-red-400 text-white px-4 py-2 rounded font-bold'
            >
              Delete
            </button>
          </div>
        </li>
      );
    });
  }

  return (
    <>
      <h1 className='bg-black text-white p-5 text-5xl font-bold text-center'>My To do list</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2'
          placeholder="Enter task here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2'
          placeholder="Enter Description here"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <select
          className='text-2xl border-zinc-800 border-2 m-5 px-4 py-2'
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className='bg-black text-white px-4 py-2 text-2xl font-bold rounded m-5'>
          {editIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <hr />

      <div className='bg-slate-200'>
        <div className='p-5'>
          <button onClick={() => setFilter("All")} className='mr-4 px-4 py-2 rounded font-bold bg-gray-400 text-white'>All</button>
          <button onClick={() => setFilter("Completed")} className='mr-4 px-4 py-2 rounded font-bold bg-green-400 text-white'>Completed</button>
          <button onClick={() => setFilter("Pending")} className='mr-4 px-4 py-2 rounded font-bold bg-red-400 text-white'>Pending</button>
        </div>
        <ul>
          {renderTask}
        </ul>
      </div>
    </>
  );
}

export default page;
