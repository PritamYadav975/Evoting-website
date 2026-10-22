const express = require("express");

const router = express.Router();

const votingController = require("../controllers/votingController");

router.get(
    "/:electionId",
    votingController.showVotingPage
);
router.post(
    "/:electionId/vote",
    votingController.castVote
);
module.exports = router;