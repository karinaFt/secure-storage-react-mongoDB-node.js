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

    const getFiles = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${baseURL}/files?page=${currentPage}&limit=8`);
            setGalleryFiles(res.data.files);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        getFiles()
    }, [getFiles]);



    return <div className={'text-slate-900 p-7'}>
        <UploadFile getFiles={getFiles} setCurrentPage={setCurrentPage} setGalleryFiles={setGalleryFiles}/>
        <Gallery getFiles={getFiles} galleryFiles={galleryFiles} setGalleryFiles={setGalleryFiles} loading={loading}/>

        <div className="flex gap-3 justify-center mt-10">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="font-bold hover:cursor-pointer">Previous</button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="font-bold hover:cursor-pointer">Next</button>
        </div>
    </div>
}
