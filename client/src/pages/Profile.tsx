import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import PreviewImage from "../components/PreviewImage";
import { baseURL } from "../utils/baseURL";
import type { User } from "../@types";


function Profile() {
    const { user, setUser } = useAuth()
    
    const [ username, setUsername ] = useState(user?.username);
    const [ email, setEmail ] = useState(user?.email);
    const [ imageFile, setImageFile ] = useState<null | File>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setImageFile(e.target.files && e.target.files[0]);
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username !== user?.username || email !== user?.email || imageFile) {
            console.log(username, email, imageFile);
            try {
                const token = localStorage.getItem("token");
                if (!token) return; // communicate that there is not token

                const headers = new Headers();
                headers.append("Authorization", "Bearer " + token);

                const body = new FormData();
                body.append("username", username!);
                body.append("email", email!)
                if (imageFile) {
                    body.append("image", imageFile);
                }
                const requestOptions = {
                    method: "POST",
                    headers: headers,
                    body: body
                };
                const response = await fetch(baseURL + "/users/update", requestOptions);
                if (response.ok) {
                    const result: User = await response.json()
                    setUser(result);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <h1>Profile of {user!.username}</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
                <label htmlFor="username">Username:</label>
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="email">Email:</label>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="image">Image:</label>
                <input id="image" type="file" onChange={handleFileChange} />
                <PreviewImage file={imageFile} current={user!.image} />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    )
}

export default Profile