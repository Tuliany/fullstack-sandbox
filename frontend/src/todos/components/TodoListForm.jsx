import React, { useState, useEffect, useRef } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Button,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'

const url = 'http://localhost:3001/api/todo'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [isChecked, setIsChecked] = useState(true)
  const [completed, setCompleted] = useState(0)
  const ref = useRef

  const finnish = todos.length === completed

  const handleSubmit = (event) => {
    event.preventDefault()
    saveTodoList(todoList.id, { todos })
    axios
      .post(url, {
        id: todoList.id,
        todos: JSON.stringify(todos.pop()).replace(/"/g, ''),
      })
      .then((res) => {
        console.log(res.data)
        setTodos([...todos, res.data])
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleComplete = (index) => {
    todos.map((todos) => {
      if (todos[index]) {
        setIsChecked(isChecked)
        if (isChecked) {
          setCompleted(completed + 1)
        }
      }
    })
  }

  useEffect(() => {
    clearTimeout(ref.current)
    ref.current = setTimeout(() => {
      ref.current = null
      console.log('Saving...', todos)
      setTodos(todos)
    }, 3000)
  }, [todos])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {finnish ? (
            <CardContent>
              <Typography component='h2'>Well done 🚀</Typography>
            </CardContent>
          ) : (
            todos.map((name, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
                  label='What to do?'
                  value={name}
                  onChange={(event) => {
                    setTodos([
                      // immutable update
                      ...todos.slice(0, index),
                      event.target.value,
                      ...todos.slice(index + 1),
                    ])
                  }}
                />
                <Checkbox
                  value={name}
                  checked={isChecked[index]}
                  onChange={() => handleComplete(index)}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
                    setTodos([
                      // immutable delete
                      ...todos.slice(0, index),
                      ...todos.slice(index + 1),
                    ])
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))
          )}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, ''])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
          <CardContent>
            <Typography component='h2'>Pending {todos.length - completed}</Typography>
            <Typography component='h2'>Completed {completed}</Typography>
          </CardContent>
        </form>
      </CardContent>
    </Card>
  )
}
