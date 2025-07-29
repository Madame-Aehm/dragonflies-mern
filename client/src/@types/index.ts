interface Owner {
    username: string
    createdAt: string
    _id: string
}

export interface Pet {
    _id: string
    name: string
    animal: "dog" | "cat" | "bird"
    owner: string | Owner
}

export interface User {
    username: string
    email: string
    _id: string
    createdAt: string
    pets: string[]
    image: string
}