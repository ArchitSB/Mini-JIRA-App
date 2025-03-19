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
    try{
        const { name } = req.params;
        const projectTasks = tasks.filter(task => task.project.toLowerCase() === name.toLowerCase());

        if (projectTasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this project" });
        }

        res.json(projectTasks);
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});


app.get('/tasks/sort/by-priority', (req, res) => {
    try{
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const sortedTasks = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

        res.json(sortedTasks);
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

//use query like this: /tasks?title=Fix%20Login%20Issue&project=Project%20Gamma&assignedTo=David&priority=high&status=open
app.get('/tasks', (req, res) => {
    try{
        const { title, project, assignedTo, priority, status } = req.query;

        if (!title || !project || !assignedTo || !priority || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newId = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
        const newTask = { id: newId, title, project, assignedTo, priority, status };

        tasks.push(newTask);
        res.status(201).json({ message: "Task added successfully", task: newTask });
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

app.get("/users/:name/tasks", (req,res) => {
    try{
        const {name} = req.params;
        const userTasks = tasks.filter(task => task.assignedTo.toLowerCase() === name.toLowerCase());
        if (userTasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this project" });
        }

        res.json(userTasks);
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

app.get("/tasks/pending", (req,res) => {
    try{
        const pendingTasks = tasks.filter(task => task.status === "open");
        if (pendingTasks.length === 0){
            return res.status(404).json({message: "No pending tasks found"});
        }
        res.json(pendingTasks);
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

app.post("/tasks/:id/status", (req,res) => {
    try{
        const {id} = req.params;
        const {status} = req.body;
        const task = tasks.find(task => task.id === parseInt(id));
        if(!task){
            return res.status(404).json({message: "Task not found"});
        }
        task.status = status;
        res.json({message: "Task status updated successfully", task});
    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
