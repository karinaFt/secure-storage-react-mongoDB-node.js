import {useState} from "react";
import axios from "axios";

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:4000/upload", formData);
            setUrl(res.data.url)
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button onClick={handleUpload}>Upload</button>
            {url && (
                <div>
                    <p>Uploaded:</p>
                    <img src={url} alt="Uploaded" width={200}/>
                </div>
            )}
        </div>
    );
};

export default UploadFile;
