const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const electionController = require("../controllers/electionController");
const upload = require("../config/multer");
router.get("/create", authMiddleware.isLoggedIn, (req, res) => {
    res.render("elections/create", {
        organization: req.session.user
    });
});
router.post(
    "/create",
    authMiddleware.isLoggedIn,
    upload.fields([
        { name: "candidateImage[]", maxCount: 20 },
        { name: "partySymbol[]", maxCount: 20 }
    ]),
    electionController.createElection
);

module.exports = router;