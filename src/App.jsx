import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notificacion'

import axios from 'axios'
import noteServices from './services/notes'




const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(' ')
  const[showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('som error happened')

  const hook= () => {

    noteServices
      .getAll()
      .then(initialNotes  =>{
        setNotes(initialNotes)
      })
  }

  useEffect(hook,[])


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content:newNote,
      important: Math.random() < 0.5,
      id: String(notes.length +1),
    }

    noteServices 
      .create(noteObject)
      .then(returnedNote => {
        setNotes (notes.concat(returnedNote))
        setNewNote('')
      })

  
  }


  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = (id) => {
    const url = 'http://localhost:3001/notes/' + id
    const note = notes.find(n => n.id===id)
    const changedNote = {...note, important: !note.important }

    noteServices
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })

      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })

  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message = {errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'importante' : 'all'}

        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>

        <input
        value={newNote}
        onChange={handleNoteChange}
        />

        <button type= 'submit'>save</button>

      </form>
    </div>
  )
}

export default App