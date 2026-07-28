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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        axios.get(`${baseURL}/files?page=${currentPage}&limit=8`)
            .then(res => {
                setGalleryFiles(res.data.files)
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error("Upload error", err))
            .finally(() => setLoading(false));
    }, [currentPage]);

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
        <Gallery handleDelete={handleDelete} galleryFiles={galleryFiles} setGalleryFiles={setGalleryFiles} loading={loading}/>

        <div className="flex gap-3 justify-center mt-10">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="font-bold hover:cursor-pointer">Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="font-bold hover:cursor-pointer">Next</button>
        </div>
    </div>
}
