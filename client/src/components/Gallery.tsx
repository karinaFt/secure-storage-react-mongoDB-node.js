import {FileCard, type FileItem} from "./FileCard.tsx";
import {SkeletonCard} from "./SkeletonCard.tsx";
import {useMemo, useState} from "react";

interface Props {
    galleryFiles: FileItem[];
    loading: boolean;
    handleDelete: (id: string) => void;
}

const Gallery = ({galleryFiles, loading, handleDelete}: Props) => {
    const [search, setSearch] = useState("");

    const filteredFiles = useMemo(() => {
        return galleryFiles.filter(file =>
            file.originalName
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [galleryFiles, search]);

    const html = loading ?
        <>{Array.from({length: 9}).map((_, index) => (
                <SkeletonCard key={index}/>
            ))}
        </>
        :
        <>{filteredFiles.map((file: FileItem) => (
                <FileCard handleDelete={handleDelete} key={file.publicId} file={file}/>
            ))}
        </>

    return (
        <>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="border rounded p-2 mb-4 w-full"/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {html}
            </div>
        </>)
};

export default Gallery;
