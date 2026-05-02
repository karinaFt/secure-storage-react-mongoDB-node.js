import {useEffect, useState} from "react";
import axios from "axios";

interface FileI {
    _id: string,
    originalName: string,
    url: string,
    uploadedAt: string,
}

const fileButtonStyles = {
    base: `
    file:mr-4 
    file:py-2 
    file:px-4 
    file:rounded-lg 
    file:border-0 
    file:font-medium 
    file:cursor-pointer 
    file:transition-colors
  `,
    outline: `
    file:bg-transparent 
    file:border-1 
    file:border-green-300 
    file:hover:bg-blue-50
  `
};

const UploadFile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/files')
            .then(res => setList(res.data))
            .catch(err => console.error("Upload error",err));
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:4000/upload", formData);
            setUrl(res.data.url)
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    return (
        <div>
            <input type="file" className={`${fileButtonStyles.base} ${fileButtonStyles.outline}`} onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <button className={'bg-gr border-green-300 hover:bg-teal-50 hover:cursor-pointer font-bold py-2 px-4 border rounded'} onClick={handleUpload}>
                Upload
            </button>

            {url && (
                <div>
                    <p>Uploaded:</p>
                    <img src={url} alt="Uploaded" width={200}/>
                </div>
            )}

            {list && (
                list.map((item:FileI) => {
                    const date = new Date(item.uploadedAt).toLocaleTimeString('uk-UA', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <>
                            <div key={item._id}>
                                <img src={item.url} alt="" width={200}/>
                                <p>{date}</p>
                            </div>
                        </>)
                    }
                )
            )}
        </div>
    );
};

export default UploadFile;
