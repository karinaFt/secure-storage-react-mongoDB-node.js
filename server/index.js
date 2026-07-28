const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require("cors");
const connectDB = require("./db");
const File = require("./models/File");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:4000",
        "https://securesstorage.netlify.app"
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
}));
dotenv.config();
app.use(express.json());

connectDB();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",

    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    "audio/mpeg",
    "audio/wav",

    "video/mp4",
    "video/quicktime",
    "video/webm",
];

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 1024 * 1024, // 1MB
    },

    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const err = new Error(`Unsupported file type ${file.mimetype}`);
            err.code = "UNSUPPORTED_FILE_TYPE";
            cb(err);
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

app.post("/upload", upload.array("files", 10), async (req, res) => {

    const cloudinaryResult = await Promise.all(                         //save to Cloudinary
        req.files.map(file => cloudinary.uploader.upload(file.path, {resource_type: "auto" })));

    const fileRecordBD = cloudinaryResult.map(                  //for mongo db
        (result, index) => ({
            originalName: req.files[index].originalname,
            url: result.secure_url,
            publicId: result.public_id,
            mimetype: req.files[index].mimetype,
            size: req.files[index].size,
        })
    );
    const savedFiles = await File.insertMany(fileRecordBD);

    //fs.unlinkSync(req.file.path);
    res.json(fileRecordBD);

    console.log('🚀Upload successfully');
});

app.get("/files", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const files = await File.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalFiles = await File.countDocuments();

        res.json({
            files,
            totalFiles,
            totalPages: Math.ceil(totalFiles / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch files"
        });
    }
});

app.patch("/files/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const originalName = req.body.originalName;
        const updatedFile = await File.findByIdAndUpdate(id, {originalName}, {new: true});

        if (!updatedFile) {
            return res.status(404).json({
                code: "FILE_NOT_FOUND",
            });
        }
        res.json(updatedFile);

    } catch (error) {
        res.status(500).json({
            code: "INTERNAL_ERROR",
            message: error.message,
        });
    }
});

app.delete("/files/:id", async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        await cloudinary.uploader.destroy(          //cloudinary delete
            file.publicId,
        );

        await File.findByIdAndDelete(               //mongo delete
            req.params.id
        );

        res.json({
            success: true,
        });

        console.log(`🚀 File deleted successfully`);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Delete failed",
        });
    }
});

//ERROR handling
app.use((err, req, res, next) => {
    console.log("ERROR:", err);

    if (err.code === "UNSUPPORTED_FILE_TYPE") {
        return res.status(400).json({
            code: err.code,
            message: err.message,
        });
    }

    if (err.name === "MulterError") {
        return res.status(400).json({
            code: "MULTER_ERROR",
            message: err.message,
        });
    }

    return res.status(500).json({
        code: "INTERNAL_ERROR",
        message: err.message,
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
