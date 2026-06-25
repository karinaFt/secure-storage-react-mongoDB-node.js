import { memo } from 'react';

export interface FileItem {
    _id: string;
    originalName: string;
    url: string;
    publicId: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
}

interface Props {
    file: FileItem;
    handleDelete: (id: string) => void;
}

export const FileCard = memo(({file, handleDelete}: Props) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");
    const isPdf = file.mimetype === "application/pdf";

    return (
        <div className="border rounded p-3 w-72">
            {isImage && (
                <img src={file.url} alt={file.originalName} className="w-full h-48 mb-2 rounded object-cover"/>
            )}
            {isVideo && (
                <video controls className="w-full">
                    <source src={file.url} type={file.mimetype}/>
                </video>
            )}
            {isAudio && (
                <audio controls className="w-full">
                    <source src={file.url} type={file.mimetype}/>
                </audio>
            )}
            {isPdf && (
                <div>
                    <p>📄 PDF</p>
                    <a href={file.url} target="_blank" rel="noreferrer">Open PDF</a>
                </div>
            )}
            {!isImage && !isVideo && !isAudio && !isPdf && (
                <div>
                    <p className={'mb-2'}>📄 Doc</p>
                    <a className={'font-bold'} href={file.url} target="_blank" rel="noreferrer">Upload</a>
                    <hr/>
                </div>
            )}

            <h4 className={'mb-1'}>{file.originalName}</h4>
            <p className={'mb-2 text-xs'}>
                {(file.size / 1024).toFixed(2)} KB
            </p>
            <p className={'text-xs mb-2'}>
                {new Date(file.uploadedAt).toLocaleTimeString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>

            <button className={'border hover:cursor-pointer py-1 px-2 rounded'} onClick={() => handleDelete(file._id)}>Delete</button>
        </div>
    );
});