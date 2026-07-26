import {memo, useState} from 'react';

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
    const [copied, setCopied] = useState(false);

    const copyLink = async () => {
        await navigator.clipboard.writeText(file.url);
        setCopied(true);
        setTimeout(() => {setCopied(false)}, 2000);
    }

    const handleRename = async () => {
        const newName = window.prompt("Enter new file name", file.originalName);
        if (!newName) {
            return;
        }
    }

    const fileNameSlice  = file.originalName.length > 28 ? `${file.originalName.slice(0,28)}...` : file.originalName;

    return (
        <div className="flex flex-col justify-items-stretch border rounded p-3 w-72">
            <div className='h-full'>
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

                <h4 className={'mb-1'}>{fileNameSlice}</h4>
                <p className={'mb-2 text-xs'}>{(file.size / 1024).toFixed(2)} KB</p>

                <p className={'text-xs mb-5'}>
                    {new Date(file.uploadedAt).toLocaleTimeString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            <div className='flex justify-between'>
                <button className={'border hover:cursor-pointer py-1 px-2 rounded'} onClick={handleRename}>Rename</button>
                <button className={'border hover:cursor-pointer py-1 px-2 rounded'} onClick={() => handleDelete(file._id)}>Delete</button>

                <button onClick={copyLink} className="px-2 py-1 mx-3 hover:cursor-pointer">
                    <span className="flex items-center">
                        <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/></svg>
                        <span className="text-xs font-semibold">{copied ? "Copied!" : "Copy Link"}</span>
                    </span>
                </button>
            </div>
        </div>
    );
});