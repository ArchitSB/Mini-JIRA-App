const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let tasks = [
    { id: 1, title: 'Fix a critical bug', project: 'Project Alpha', assignedTo: 'Bob', priority: 'high', status: 'open' },
    { id: 2, title: 'Implement a new feature', project: 'Project Alpha', assignedTo: 'Charlie', priority: 'medium', status: 'in progress' },
    { id: 3, title: 'Write documentation', project: 'Project Beta', assignedTo: 'Bob', priority: 'low', status: 'open' }
];


app.get('/projects/:name/tasks', (req, res) => {
    const { name } = req.params;
    const projectTasks = tasks.filter(task => task.project.toLowerCase() === name.toLowerCase());

    if (projectTasks.length === 0) {
        return res.status(404).json({ message: "No tasks found for this project" });
    }

    res.json(projectTasks);
});


app.get('/tasks/sort/by-priority', (req, res) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    res.json(sortedTasks);
});

//use query like this: /tasks?title=Fix%20Login%20Issue&project=Project%20Gamma&assignedTo=David&priority=high&status=open
app.get('/tasks', (req, res) => {
    const { title, project, assignedTo, priority, status } = req.query;

    if (!title || !project || !assignedTo || !priority || !status) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    const newTask = { id: newId, title, project, assignedTo, priority, status };

    tasks.push(newTask);
    res.status(201).json({ message: "Task added successfully", task: newTask });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
