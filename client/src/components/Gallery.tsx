import {FileCard, type FileItem} from "./FileCard.tsx";

interface Props {
    uploadedFiles: FileItem[];
}

const Gallery = ({uploadedFiles}: Props) => {
    return (
        <>
            {uploadedFiles &&
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedFiles.map((file: FileItem) => (
                        <FileCard key={file._id} file={file}/>
                    ))}
                </div>}
        </>
    );
};

export default Gallery;
