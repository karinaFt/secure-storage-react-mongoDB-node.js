import Gallery from "./components/Gallery.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import type {FileItem} from "./components/FileCard.tsx";
import UploadFile from "./components/UploadFile.tsx";

export default function App() {
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://secure-storage-react-mongodb-node-js.onrender.com/files')
            .then(res => setUploadedFiles(res.data))
            .finally(() => setLoading(false))
            .catch(err => console.error("Upload error", err));
    }, []);

    return <div className={'m-5'}>
        <UploadFile setUploadedFiles={setUploadedFiles} />
        <Gallery uploadedFiles={uploadedFiles} loading={loading}/>
    </div>
}
