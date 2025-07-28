import { useEffect, useState } from "react"

type Props = {
    file: File | null,
    current?: string
}

const PreviewImage = ({ file, current }: Props) => {
    const [tempURL, setTempURL] = useState("");
    const display = tempURL || current;
    
    useEffect(() => {
        if (file) {
            setTempURL(URL.createObjectURL(file))
        }

        return () => {
            URL.revokeObjectURL(tempURL);
            setTempURL("")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])
        
    if (display) return (
        <img src={display} alt="preview image" style={{ width: "100px" }} />
    )
    
}

export default PreviewImage