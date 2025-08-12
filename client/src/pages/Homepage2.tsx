import { useEffect, useState } from 'react'
import '../App.css'
import { baseURL } from '../utils/baseURL'
import type { Pet } from '../@types'
import PetCard from '../components/PetCard'

function Homepage2() {
  const [pets, setPets] = useState<Pet[]>([])
  const [on, setOn] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  const getData = async() => {
    console.log("getting data")
    try {
      const response = await fetch(baseURL + "/pets?search=" + filterValue)
      const result: Pet[] = await response.json()
      console.log(result)
      setPets(result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [filterValue])

  return (
    <>
      <h1>Here are the pets!!!</h1>
      <button onClick={() => setOn(!on)}>Switch</button>
      <p>{ on ? "ON" : "OFF" }</p>
      <input type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      { pets.map((pet) => {
        return <PetCard key={pet._id} pet={pet} />
      }) }
    </>
  )
}

export default Homepage2
