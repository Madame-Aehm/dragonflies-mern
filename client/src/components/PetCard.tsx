import { memo } from 'react'
import type { Pet } from '../@types'

type Props = {
    pet: Pet
}

const PetCard = memo(({ pet }: Props) => {
    // console.log("pet card " + pet.name + " renders")
    return (
        <div style={{ border: "solid black 2px", paddingLeft: "1em", paddingRight: "1em", marginBottom: "1em" }}>
            <p>{pet.name} the {pet.animal}</p>
            <p>Owned by {typeof pet.owner !== "string" && pet.owner.username}</p>
        </div>
    )
})

export default PetCard