const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require("cors");
const connectDB = require("./db");
const File = require("./models/File");

dotenv.config();
const app = express();

app.use(cors({origin: "http://localhost:4000"}));
dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

const allowedMimeTypes = [
    // images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",

    // documents
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // audio
    "audio/mpeg",
    "audio/wav",

    // video
    "video/mp4",
    "video/quicktime",
    "video/webm",
];

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },

    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type"));
        }
    }
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path,  {
            resource_type: "auto",
        });

        const fileRecord = new File({
            originalName: req.file.originalname,
            url: result.secure_url,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });
        await fileRecord.save();

        fs.unlinkSync(req.file.path);
        res.json({url: result.secure_url});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Upload failed"});
    }
});

app.get("/files", async (req, res) => {
    try {
        const files = await File.find().sort({uploadedAt: -1});
        res.json(files);
    } catch (err) {
        res.status(500).json({message: "Failed to fetch files"});
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
