import { Grid, Typography, Card, CardContent, TextField, Button, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskForm() {

  const [task, setTask] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    /* PUT */
    if (editing) {
      await fetch(`http://localhost:4000/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        }, 
        body: JSON.stringify(task)
      });
    } else {
      await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" }
      });
    }

    setLoading(false)

    /* Redirection to main page navigate('/') */
    navigate('/')
  }

  const handleChange = e =>
    setTask({ ...task, [e.target.name]: e.target.value });

  const loadTask = async (id) => {
    const res = await fetch(`http://localhost:4000/tasks/${id}`)
    const data = await res.json()
    setTask({ title: data.title, description: data.description })
    setEditing(true)
  }

  useEffect(() => {
    if (params.id) {
      loadTask(params.id);
    }
  }, [params.id])

  return (

    <Grid container direction='column' alignItems='center' justifyContent='center'>
      <Grid item xs={3}>
        <Card sx={{ mt: 5 }} style={{
          backgroundColor: '#1e272e',
          padding: '1rem'
        }}>

          <Typography variant='5' textAlign='center' color='white'>
            {/* The next function allows to change the text depending on the state */}
            {editing ? "Edit task" : "Create task"}
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>

              {/* TextField = input in material UI */}

              <TextField
                variant='filled'
                label='Write your title'
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}

                name='title'
                value={task.title}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />

              <TextField
                variant='filled'
                label='Write your description'
                multiline
                rows={4}
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}

                name='description'
                /* Value={task.description} shows the current title and description on the field */
                value={task.description}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              {/* If there´s not title nor description it disables the button !task.title || !task.description */}
              <Button variant='contained' color='primary' type='submit' disabled={
                !task.title || !task.description
              }>
                {loading ? (<CircularProgress
                  color='inherit' size={24}
                />) : (
                  'Save'
                  )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}