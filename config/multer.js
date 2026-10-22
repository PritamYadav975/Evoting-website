
require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: async (req, file) => {
        let folder;

        if (file.fieldname === "candidateImage[]") {
            folder = "e-voting/candidates";
        } else if (file.fieldname === "partySymbol[]") {
            folder = "e-voting/symbols";
        } else {
            throw new Error("Invalid file field");
        }

        return {
            folder: folder,
            resource_type: "image",
            public_id: `${Date.now()}-${file.originalname
                .replace(/\.[^/.]+$/, "")
                .replace(/[^a-zA-Z0-9_-]/g, "_")}`
        };
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

module.exports = upload;
