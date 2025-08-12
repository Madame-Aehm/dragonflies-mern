import { useState } from 'react'
import '../App.css'
import PetCard from '../components/PetCard'
import useGetPets from '../hooks/useGetPets'

function Homepage3() {
    const [on, setOn] = useState(true);
    const [filterValue, setFilterValue] = useState("")
    const { pets, loading, error } = useGetPets(filterValue)
    return (
        <>
        <h1>Here are the pets!!!</h1>
        <button onClick={() => setOn(!on)}>Switch</button>
        <p>{ on ? "ON" : "OFF" }</p>
        <input type="text" onChange={(e) => setFilterValue(e.target.value)} />
        { loading && <h1>Loading...</h1>}
        { error && <p style={{ color: "red"}}>{error}</p>}
        {(!error && !loading) && 
            pets.map((pet) => {
            return <PetCard key={pet._id} pet={pet} />
        }) }
        
        </>
    )
}

export default Homepage3
