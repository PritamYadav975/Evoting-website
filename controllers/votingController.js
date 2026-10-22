const db = require("../config/db");

const showVotingPage = async (req, res) => {

    try {

        const electionId = req.params.electionId;

        // Get election
        const [elections] = await db.query(
            `
            SELECT *
            FROM elections
            WHERE id = ?
            `,
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(404).send("Election not found");
        }

        const election = elections[0];

        // Get candidates with party information
        const [candidates] = await db.query(
            `
            SELECT
                candidates.id,
                candidates.name,
                candidates.image,
                candidates.position,
                candidates.constituency,
                parties.name AS party_name,
                parties.symbol_image
            FROM candidates
            LEFT JOIN parties
                ON candidates.party_id = parties.id
            WHERE candidates.election_id = ?
            `,
            [electionId]
        );

        res.render("voting/voting", {
            election,
            candidates
        });

    } catch (error) {

        console.error("Loading voting page failed:", error);

        res.status(500).send(
            "Failed to load voting page"
        );
    }
};
 const castVote = async (req, res) => {

    try {

        const electionId = req.params.electionId;
        const { candidateId } = req.body;

        // Check that candidate belongs to this election
        const [candidates] = await db.query(
            `
            SELECT id
            FROM candidates
            WHERE id = ?
            AND election_id = ?
            `,
            [candidateId, electionId]
        );

        if (candidates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate"
            });
        }

        // Save vote
        const voteModel = require("../models/voteModel");

        await voteModel.createVote(
            db,
            electionId,
            candidateId
        );

        res.json({
            success: true,
            message: "Vote recorded successfully"
        });

    } catch (error) {

        console.error("Voting failed:", error);

        res.status(500).json({
            success: false,
            message: "Failed to record vote"
        });
    }
};
module.exports = {
    showVotingPage,
    castVote
};