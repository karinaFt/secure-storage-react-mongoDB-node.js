import {useEffect, useState} from "react";
import axios from "axios";

interface FileI {
    _id: string,
    originalName: string,
    url: string,
    uploadedAt: string,
}

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/files')
            .then(res => setList(res.data))
            .catch(err => console.error("Upload error",err));
    }, []);

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
            <p><button onClick={handleUpload}>Upload</button></p>

            {url && (
                <div>
                    <p>Uploaded:</p>
                    <img src={url} alt="Uploaded" width={200}/>
                </div>
            )}

            {list && (
                list.map((item:FileI) => {
                    const date = new Date(item.uploadedAt).toLocaleTimeString('uk-UA', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <>
                            <div key={item._id}>
                                <img src={item.url} alt="" width={200}/>
                                <p>{date}</p>
                            </div>
                        </>)
                    }
                )
            )}
        </div>
    );
};

export default UploadFile;
