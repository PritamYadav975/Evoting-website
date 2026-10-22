const multer = require("multer");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "candidateImage[]") {
            cb(null, "uploads/candidates");
        }
        
        else if (file.fieldname === "partySymbol[]") {
            cb(null, "uploads/symbols");
        }
        else {
            cb(new Error("Invalid file field"));
        }

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage: storage
});

module.exports = upload;