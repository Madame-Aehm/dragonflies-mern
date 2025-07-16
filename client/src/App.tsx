import { useEffect } from 'react'
import './App.css'
import { baseURL } from './utils/baseURL'

function App() {

  useEffect(() => {
    const getData = async() => {
      try {
        const response = await fetch(baseURL + "/users")
        const result = await response.json()
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  return (
    <h1>hello</h1>
  )
}

export default App
