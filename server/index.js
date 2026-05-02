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

const upload = multer({dest: "uploads/"});

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
        const result = await cloudinary.uploader.upload(req.file.path);

        const fileRecord = new File({
            originalName: req.file.originalname,
            url: result.secure_url,
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
