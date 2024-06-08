import React, {useState, useEffect} from "react";
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"

function App(){
  // const [todos, setTodos] = useState([])
  const [data, setData] = useState({
    id: "",
    title: 0,
    completed: "",
});
  const [todos, setTodos] = useState([])
  // const [todos, setTodos] = useState(() => {
  //   const localValue = localStorage.getItem("ITEMS")
  //   if(localValue === null) return []

  //   return JSON.parse(localValue)
  // })

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    // Using fetch to fetch the api from 
    // flask server it will be redirected to proxy
    fetch("/data").then((res) =>
        res.json().then((data) => {
            console.log(data)
            setData(data)
            // convert(data)
            setTodos(convert(data))
        })
    );
}, []);

  function addTodo(title){
    var ID = crypto.randomUUID()
    setTodos((currentTodos) => {
          return [...currentTodos, {id: ID, title, completed: false},]
        })

      fetch("/data", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: ID, title, completed: false})
        }).then(res => {
          return res.json()
        }        
      ).then(
        (data) => {
          console.log(data)
          console.log("New item in DB")
        }
      )
    
  }

  function toggleTodo(id, completed){
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if(todo.id === id){
          return { ...todo, completed}
        }
        console.log(todos);
        return todo
      })
    })

    fetch("/toggle", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ID: id,  completed: completed})
    })

  }

  function deleteTodo(id){
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })

    fetch("/delete", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ID: id})
    })
  
  }
  function convert(data) {
    console.log("Here")
    var a = []
    if(typeof data !== 'undefined'){
      var D = Object.values(data)
      D.map((member, i) => (
        a.push({id: member['id'], title: member['title'], completed: member['completed']})
      ))
    }
    return a
  }


  return (
    <div>
      <NewTodoForm onSubmit={addTodo}/>
      <h1>Todo List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
      <p>Hi</p>
      {console.log(convert(data))}
      {console.log(todos)}
    </div>
  )
}

export default App