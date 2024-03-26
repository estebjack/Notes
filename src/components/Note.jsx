const Note = ({ note , toggleImportance}) => {

  const label = note.important ? 'make not importance' : 'make importante'

  return (
    <li>{note.content}.... 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note