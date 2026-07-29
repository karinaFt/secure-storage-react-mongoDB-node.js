import {FileCard, type FileItem} from "./FileCard.tsx";
import {SkeletonCard} from "./SkeletonCard.tsx";
import {useCallback, useMemo, useState} from "react";
import {baseURL} from "../App.tsx";
import axios from "axios";

interface Props {
    galleryFiles: FileItem[];
    loading: boolean;
    setGalleryFiles:React.Dispatch<React.SetStateAction<FileItem[]>>;
    getFiles: () => Promise<void>;
}

const Gallery = ({galleryFiles, loading, getFiles}: Props) => {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [filerByType, setFilerByType] = useState("/");

    const filteredFiles = useMemo(() => {

        const filtered = galleryFiles
            .filter(file =>
                file.originalName
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
            .filter(file =>
                file.mimetype
                    .includes(filerByType));

        switch (sortBy) {
            case "oldest":
                return [...filtered].reverse();

            case "name-asc":
                return [...filtered].sort((a, b) =>
                    a.originalName.localeCompare(b.originalName)
                );

            case "name-desc":
                return [...filtered].sort((a, b) =>
                    b.originalName.localeCompare(a.originalName)
                );

            default:
                return filtered;
        }
    }, [galleryFiles, search, sortBy, filerByType]);

    const renameFile = useCallback(async (id: string, originalName: string |  null) => {
            try {
                await axios.patch(`${baseURL}/files/${id}`, {originalName});
                await getFiles();

            } catch (error) {
                console.error(error);
            }
        },[getFiles]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            const confirmed = window.confirm("Are you sure you want to delete this file?");
            if (!confirmed) {return;}

            try {
                await axios.delete(`${baseURL}/files/${id}`);
                await getFiles()

            } catch (error) {
                console.error(error);
                alert("Failed to delete file");
            }
        }, [getFiles]
    );

    const html = loading ?
        <>{Array.from({length: 9}).map((_, index) => (
                <SkeletonCard key={index}/>
            ))}</>
        :
        <>{filteredFiles.map((file: FileItem) => (
                <FileCard renameFile={renameFile} handleDelete={handleDelete} key={file.publicId} file={file}/>
            ))}</>

    return (
        <div className="pt-6">
            <input type="text" name='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="border rounded p-2 mb-7 w-1/2"/>

            <select value={filerByType} name='filerByType' onChange={(e) => setFilerByType(e.target.value)} className="border rounded p-2 mx-6 px-5">
                <option value="/">Type</option>
                <option value="audio">Audio</option>
                <option value="image">Images</option>
                <option value="video">Video</option>
                <option value="text">Doc</option>
                <option value="pdf">PDF</option>
                <option value="wordprocessingml.document">Microsoft Word</option>
                <option value="presentationml.presentation">Presentation</option>
            </select>

            <select value={sortBy} name='sortBy' onChange={(e) => setSortBy(e.target.value)} className="border rounded p-2 mx-6 px-5">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
            </select>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
                {html}
            </div>
        </div>)
};

export default Gallery;
