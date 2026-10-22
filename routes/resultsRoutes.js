const express = require("express");

const router = express.Router();

const resultsController = require("../controllers/resultsController");
router.get(
    "/:electionId/download",
    resultsController.downloadResults
);
router.get(
    "/:electionId",
    resultsController.showResults
);

module.exports = router;