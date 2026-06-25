import {useState} from "react";
import axios from "axios";
import type {FileItem} from "./FileCard.tsx";
import {baseURL} from "../App.tsx";

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
    setGalleryFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const UploadFiles = ({setGalleryFiles}: Props) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        
        setUploading(true);

        try {
            const res = await axios.post(`${baseURL}/upload`, formData
            );

            setGalleryFiles(prevFiles => [res.data, ...prevFiles]);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.data.code);
                alert(err.response?.data.message);
            }
            console.error("Upload error", err);
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className='mb-4 flex justify-between items-baseline'>
            <input type="file" className={`${fileButtonStyles.base} ${fileButtonStyles.outline}`}
                   onChange={(e) => setFile(e.target.files?.[0] || null)}/>

            <div className={'flex flex-col items-end'}>
            <button disabled={uploading} className={'border hover:cursor-pointer font-bold py-2 px-4 rounded mb-1'} onClick={handleUpload}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            </div>
        </div>
    );
};

export default UploadFiles;
