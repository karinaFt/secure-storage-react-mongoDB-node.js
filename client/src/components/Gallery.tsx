import {FileCard, type FileItem} from "./FileCard.tsx";
import {SkeletonCard} from "./SkeletonCard.tsx";

interface Props {
    uploadedFiles: FileItem[];
    loading: boolean;
}

const Gallery = ({uploadedFiles, loading}: Props) => {

    const html = loading ?
        <>
            {Array.from({length: 9}).map((_, index) => (
                <SkeletonCard key={index}/>
            ))}
        </>
        :
        <>
            {uploadedFiles.map((file: FileItem) => (
                <FileCard key={file._id} file={file}/>
            ))}
        </>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {html}
        </div>)
};

export default Gallery;
