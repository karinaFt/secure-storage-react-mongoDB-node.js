import {useState} from "react";
import axios from "axios";
import type {FileItem} from "./FileCard.tsx";

const fileButtonStyles = {
    base: `
    file:mr-4 
    file:py-2 
    file:px-4 
    file:rounded-lg 
    file:font-medium 
    file:cursor-pointer 
    file:transition-colors
  `,
    outline: `
    file:border
  `
};

interface Props {
    setUploadedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const UploadFiles = ({setUploadedFiles}: Props) => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("https://secure-storage-react-mongodb-node-js.onrender.com/upload", formData);

            setUploadedFiles(prev => [res.data, ...prev]);
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    return (
        <div className='mb-4 flex justify-between'>
            <input type="file" className={`${fileButtonStyles.base} ${fileButtonStyles.outline}`}
                   onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button
                className={'bg-gr border hover:cursor-pointer font-bold py-2 px-4 rounded'} onClick={handleUpload}>
                Upload
            </button>
        </div>
    );
};

export default UploadFiles;
