import { useEffect, useState } from 'react'
import '../App.css'
import { baseURL } from '../utils/baseURL'
import type { Pet } from '../@types'

function Homepage() {
  const [pets, setPets] = useState<Pet[]>([])

  useEffect(() => {
    const getData = async() => {
      try {
        const response = await fetch(baseURL + "/pets")
        const result: Pet[] = await response.json()
        console.log(result)
        setPets(result)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  return (
    <>
      <h1>Here are the pets!!!</h1>
      { pets.map((pet) => {
        return <div key={pet._id} style={{ border: "solid black 2px", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1em" }}>
          <p>{pet.name} the {pet.animal}</p>
          <p>Owned by {typeof pet.owner !== "string" && pet.owner.username}</p>
        </div>
      }) }
    </>
  )
}

export default Homepage
