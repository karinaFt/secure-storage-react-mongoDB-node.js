import { useState} from "react";
import axios from "axios";
import type {FileItem} from "./FileCard.tsx";
import {baseURL} from "../App.tsx";
import {useDropzone} from "react-dropzone";

interface Props {
    setGalleryFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

const UploadFiles = ({setGalleryFiles}: Props) => {
    const [files, setFiles] = useState<File[] >([]);
    const [uploading, setUploading] = useState(false);

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(prev => [...acceptedFiles, ...prev,]);
        },
    });

    const handleUpload = async () => {
        if (!files) return;

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append("files", file);
            setUploading(true);
        });

        try {
            const res = await axios.post(`${baseURL}/upload`, formData);
            setFiles([]);
            setGalleryFiles(prevFiles => [...res.data, ...prevFiles]);
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

    const filesList = acceptedFiles.map(file => (
        <li key={file.path} className={'pb-2'}>
            {file.path}
            <p className={'text-xs'}>{file.size} bytes</p>
        </li>
    ));

    return (
        <>
            <div className="flex flex-col">
                <div {...getRootProps({className: 'dropzone h-20 border border-gray-500 rounded mb-5'})}>
                    <input {...getInputProps()}/>
                    <p className={'text-gray-500 p-3'}>Drag 'n' drop some files here, or click to select files</p>
                </div>

                <ul>{filesList}</ul>
            </div>

            <div className='mb-4 flex justify-between items-baseline'>
                <div className={'flex flex-col items-end'}>
                    <button disabled={uploading || files.length === 0} onClick={handleUpload} type={'button'} className={'border hover:cursor-pointer font-bold py-2 px-4 rounded mb-1 disabled:text-gray-500'}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default UploadFiles;
