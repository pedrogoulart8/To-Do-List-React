import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"


const API = "http://localhost:5000"


function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    const loadData = async () => {

      setLoading(true)

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data )

      //Primeiro guardamos os valores da API em 'res'
      //Depois transformamos esses dados em JSON
      //Depois pegamos essa resposta, transformamos na variavel data e retornamos 'data'

      setLoading(false)
      //Ja carregados os dados, pode retornar o loading para inativo

      setTodos(res)
      //'todos' atualizado para os dados adicionados recentemente em 'res'

    }

    loadData()
    

  }, []) 
  //[] acima responsável para executar o comando quando a pagina carrega 



  const handleSubmit = async (e) => {

    e.preventDefault()

    const todo = {

      id: Math.random(),
      title,
      time,
      done: false

    }

    await fetch(API + "/todos", {
      
      method: "POST",
      //Inserindo dados

      body: JSON.stringify(todo),
      //receber dados como string

      headers: {
        "content-type": "application/json"
      }

    })


    setTodos((prevState) => [...prevState, todo])
    //'prevState' = Estado anterior 
    //Função visa adicionar um item ao estado anterior e gerar um novo estado


    setTitle('')
    setTime('')

  }


  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id , {
      
      method: "DELETE",

    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
    
  }


  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(API + "/todos/" + todo.id , {
      
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "content-type": "application/json"
      }

    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id) ? (t = data) : t))
    //Se o id de 't' for igual ao id do data, vou atualizar todo o objeto pelo o que veio do backEnd
    //Caso nao, mantem 't' mesmo


  }


  return (

    <div className='app'>

      <div className='todo-header'>
        <h1>React To Do List</h1>
      </div>

      <div className='form-todo'>
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit} >

          <div className='form-control'>

            <label htmlFor='title'> Tarefa:</label>
            <br />
            <input
              type='text'
              name='title'
              placeholder='Titulo da tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>

          <div className='form-control'>
            <label htmlFor='time'> Duração:</label>
            <br />
            <input
              type='text'
              name='time'
              placeholder='Tempo estimado (horas)'
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>

          <input type='submit' value='Criar Tarefa' />

        </form>
      </div>

      <div className='list-todo'>
        <h2>Lista de tarefas: </h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo-done' : '' } >{todo.title}</h3>
            <p>Duração: {todo.time} horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)} >{!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}</span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
              <hr/>
            </div>
          </div>
        ))}
      </div>

    </div>

  );
}

export default App;
