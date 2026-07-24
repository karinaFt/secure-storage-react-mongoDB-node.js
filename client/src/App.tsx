import Gallery from "./components/Gallery.tsx";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import type {FileItem} from "./components/FileCard.tsx";
import UploadFile from "./components/UploadFile.tsx";

//export const baseURL = "http://localhost:4000";
export const baseURL = "https://secure-storage-react-mongodb-node-js.onrender.com";

export default function App() {
    const [galleryFiles, setGalleryFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseURL}/files`)
            .then(res => setGalleryFiles(res.data))
            .catch(err => console.error("Upload error", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            const confirmed = window.confirm("Are you sure you want to delete this file?");
            if (!confirmed) {return;}

            try {
                await axios.delete(`${baseURL}/files/${id}`);

                setGalleryFiles(prevFiles => prevFiles.filter(file => file._id !== id));
            } catch (error) {
                console.error(error);
                alert("Failed to delete file");
            }
        }, []
    );

    return <div className={'text-slate-900 p-7'}>
        <UploadFile setGalleryFiles={setGalleryFiles}/>
        <Gallery handleDelete={handleDelete} galleryFiles={galleryFiles} loading={loading}/>
    </div>
}
