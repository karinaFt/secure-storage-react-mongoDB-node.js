import Gallery from "./components/Gallery.tsx";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import type {FileItem} from "./components/FileCard.tsx";
import UploadFile from "./components/UploadFile.tsx";

//export const baseURL = "http://localhost:4000";
export const baseURL = "https://secure-storage-react-mongodb-node-js.onrender.com";

export default function App() {
    const [uploadedFiles, setGalleryFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseURL}/files`)
            .then(res => setGalleryFiles(res.data))
            .catch(err => console.error("Upload error", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await axios.delete(`http://localhost:4000/files/${id}`);

                setGalleryFiles(prevFiles =>
                    prevFiles.filter(file => file._id !== id)
                )
            } catch (error) {
                console.error(error);
                alert("Failed to delete file");
            }
        }, []
    );

    return <div className={'m-5'}>
        <UploadFile setGalleryFiles={setGalleryFiles}/>
        <Gallery handleDelete={handleDelete} uploadedFiles={uploadedFiles} loading={loading}/>
    </div>
}
