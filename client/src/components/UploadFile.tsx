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
  `
};

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/files')
            .then(res => setList(res.data))
            .catch(err => console.error("Upload error", err));
    }, [url]);

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
        <>
            <div className='mb-4 flex justify-between'>
                <input type="file" className={`${fileButtonStyles.base} ${fileButtonStyles.outline}`}
                       onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                <button
                    className={'bg-gr border hover:cursor-pointer font-bold py-2 px-4 rounded'} onClick={handleUpload}>
                    Upload
                </button>
            </div>

            <div className={'h-10'}>
            {url && (
                <p className={'text-xs'}>Uploaded file: {url}</p>
            )}
            </div>

            {list &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((file: FileItem) => (
                        <FileCard key={file._id} file={file}/>
                    ))}
                </div>}
        </>
    );
};

export default UploadFile;
