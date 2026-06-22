import {useEffect, useState} from "react";
import axios from "axios";
import {FileCard, type FileItem} from "./FileCard.tsx";

const fileButtonStyles = {
    base: `
    file:mr-4 
    file:py-2 
    file:px-4 
    file:rounded-lg 
    file:border-0 
    file:font-medium 
    file:cursor-pointer 
    file:transition-colors
  `,
    outline: `
    file:bg-transparent 
    file:border-1 
    file:border-green-300 
    file:hover:bg-blue-50
  `
};

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
            <input type="file" className={`${fileButtonStyles.base} ${fileButtonStyles.outline}`}
                   onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button
                className={'bg-gr border-green-300 hover:bg-teal-50 hover:cursor-pointer font-bold py-2 px-4 border rounded'}
                onClick={handleUpload}>
                Upload
            </button>

            {url && (
                <div>
                    <p>Uploaded file: {url}</p>
                </div>
            )}

            {list &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((file: FileItem) => (
                        <FileCard
                            key={file._id}
                            file={file}/>
                    ))}
                </div>}
        </div>
    );
};

export default UploadFile;
