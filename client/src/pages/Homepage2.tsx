import { useCallback, useEffect, useRef, useState } from 'react'
import '../App.css'
import { baseURL } from '../utils/baseURL'
import type { Pet } from '../@types'
import PetCard from '../components/PetCard'

function Homepage2() {
  const [pets, setPets] = useState<Pet[]>([])
  const [on, setOn] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  const getData = useCallback(async() => {
    // console.log("getting data")
    try {
      const response = await fetch(baseURL + "/pets?search=" + filterValue)
      const result: Pet[] = await response.json()
      // console.log(result)
      setPets(result)
    } catch (error) {
      console.log(error)
    }
  }, [filterValue])

  useEffect(() => {
    // console.log("use effect runs")
    getData()
  }, [getData])

  // component render counter
  // const count = useRef(1);
  // console.log(count);

  // useEffect(() => {
  //     count.current = count.current + 1;
  // });

    const ref = useRef<HTMLInputElement | null>(null)
    console.log(ref)
    const value = useRef("")

  return (
    <>
      <h1>Here are the pets!!!</h1>
      <button onClick={() => setOn(!on)}>Switch</button>
      <p>{ on ? "ON" : "OFF" }</p>
      <input ref={ref} onChange={(e) => value.current = e.target.value} />
      <button onClick={() => ref.current?.focus()}>focus input</button>
      <input type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      { pets.map((pet) => {
        return <PetCard key={pet._id} pet={pet} />
      }) }
    </>
  )
}

export default Homepage2
