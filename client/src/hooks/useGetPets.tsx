import { useEffect, useRef, useState } from 'react'
import { baseURL } from '../utils/baseURL'
import type { Pet } from '../@types'



const useGetPets = (filterValue: string) => {
    const [pets, setPets] = useState<Pet[]>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const debounceTimeout = useRef(0)

    const getData = async(filterValue: string) => {
        debounceTimeout.current = setTimeout(async() => {
            console.log("getting data")
            setError("")
            setLoading(true)
            try {
                const response = await fetch(baseURL + "/pets?search=" + filterValue)
                if (response.ok) {
                    const result: Pet[] = await response.json()
                    // console.log(result)
                    setPets(result)
                } else {
                    const result: { error: string } = await response.json()
                    setError(result.error)
                }
            } catch (error) {
                console.log(error)
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("Something went wrong :(")
                }
            } finally {
                setLoading(false)
            }
        }, 500)
    }

    useEffect(() => {
        getData(filterValue)
        return () => {
            clearTimeout(debounceTimeout.current)
        }

    }, [filterValue])

    return { pets, loading, error }
}

export default useGetPets