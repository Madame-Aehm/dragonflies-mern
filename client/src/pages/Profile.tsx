import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import PreviewImage from "../components/PreviewImage";


function Profile() {
    const { user } = useAuth()
    
    const [ username, setUsername ] = useState(user?.username);
    const [ email, setEmail ] = useState(user?.email);
    const [ imageFile, setImageFile ] = useState<null | File>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        setImageFile(e.target.files && e.target.files[0]);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username !== user?.username || email !== user?.email || imageFile) {
            console.log(username, email, imageFile);
            // use form data to send request
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
                <PreviewImage file={imageFile} />
            </form>
        </div>
    )
}

export default Profile