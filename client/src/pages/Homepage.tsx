import { useEffect, useMemo, useState } from 'react'
import '../App.css'
import { baseURL } from '../utils/baseURL'
import type { Pet } from '../@types'
import PetCard from '../components/PetCard'

function Homepage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [on, setOn] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  const filteredPets = useMemo(() => {
      return pets.filter(pet => {
      for (let i = 0; i < 100000000; i++) {;}
      // console.log("filtering...");
      return filterValue 
        ? pet.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) 
        : true
    })
  }, [pets, filterValue])

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
    getData();
  }, [])

  return (
    <>
      <h1>Here are the pets!!!</h1>
      <button onClick={() => setOn(!on)}>Switch</button>
      <p>{ on ? "ON" : "OFF" }</p>
      <input type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      { filteredPets.map((pet) => {
        return <PetCard key={pet._id} pet={pet} />
      }) }
    </>
  )
}

export default Homepage
