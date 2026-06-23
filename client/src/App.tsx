import Gallery from "./components/Gallery.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import type {FileItem} from "./components/FileCard.tsx";
import UploadFile from "./components/UploadFile.tsx";

export default function App() {
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);

    useEffect(() => {
        axios.get('http://localhost:4000/files')
            .then(res => setUploadedFiles(res.data))
            .catch(err => console.error("Upload error", err));
    }, []);

    console.log(uploadedFiles)

    return <div className={'m-5'}>
        <UploadFile setUploadedFiles={setUploadedFiles} />
        <Gallery uploadedFiles={uploadedFiles}/>
    </div>
}
