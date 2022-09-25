const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001
const todoList = require('./todos.js')

app.get('/', (req, res) => res.send('Hello  World!'))

app.get('/api/todos', (req, res) => {
  res.json(todoList)
})

app.post('/api/todo', (req, res) => {
  const newTodo = {
    id: todoList.length + 1,
    title: req.body.title,
    todos: req.body.todos,
  }
  todoList.push(newTodo)
  res.status(201).json(newTodo)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
