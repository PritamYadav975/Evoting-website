const db = require("../config/db");
const PDFDocument = require("pdfkit");
const candidateModel = require("../models/candidateModel");
const showResults = async (req, res) => {

    try {

        const electionId = req.params.electionId;

        // Get election
        const [elections] = await db.query(
            `
            SELECT elections.*, organizations.name AS organization_name
            FROM elections
            JOIN organizations
                ON elections.organization_id = organizations.id
            WHERE elections.id = ?
            `,
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(404).send("Election not found");
        }

        const election = elections[0];

        const candidates =
            await candidateModel.getCandidatesWithVoteCounts(db, electionId);

        // Find highest vote count
        const highestVotes =
            candidates.length > 0
                ? Number(candidates[0].vote_count)
                : 0;

        // Find all candidates having highest votes
        const winners = candidates.filter(
            candidate =>
                Number(candidate.vote_count) === highestVotes
        );

        // Tie if more than one candidate has highest votes
        const isTie = winners.length > 1;

        res.render("results/results", {
            election,
            candidates,
            winners,
            highestVotes,
            isTie
        });

    } catch (error) {

        console.error("Loading results failed:", error);

        res.status(500).send(
            "Failed to load results"
        );
    }
};
const downloadResults = async (req, res) => {

    try {

        const electionId = req.params.electionId;

        // Get election
        const [elections] = await db.query(
            `
            SELECT elections.*, organizations.name AS organization_name
            FROM elections
            JOIN organizations
                ON elections.organization_id = organizations.id
            WHERE elections.id = ?
            `,
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(404).send("Election not found");
        }

        const election = elections[0];


        const candidates =
            await candidateModel.getCandidatesWithVoteCounts(db, electionId);


        // Find highest votes
        const highestVotes =
            candidates.length > 0
                ? Number(candidates[0].vote_count)
                : 0;


        const winners = candidates.filter(
            candidate =>
                Number(candidate.vote_count) === highestVotes
        );


        const isTie = winners.length > 1;


        // Create PDF
        const doc = new PDFDocument({
            margin: 50
        });


        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="election-results-${electionId}.pdf"`
        );


        doc.pipe(res);


        // =========================
        // TITLE
        // =========================

        doc
            .fontSize(16)
            .text(election.organization_name, {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(24)
            .text("ELECTION RESULT", {
                align: "center"
            });

        doc.moveDown();


        doc
            .fontSize(18)
            .text(election.name, {
                align: "center"
            });

        doc.moveDown();


        doc
            .fontSize(12)
            .text(
                `Election Type: ${election.category}`,
                {
                    align: "center"
                }
            );


        doc.moveDown(2);


        // =========================
        // WINNER / TIE
        // =========================

        if (isTie) {

            doc
                .fontSize(20)
                .text("ELECTION RESULT: TIE", {
                    align: "center"
                });

            doc.moveDown();


            doc
                .fontSize(12)
                .text(
                    "Two or more candidates received the same highest number of votes.",
                    {
                        align: "center"
                    }
                );

            doc.moveDown(2);


            doc
                .fontSize(16)
                .text("Candidates with Highest Votes:");

            doc.moveDown();


            winners.forEach(winner => {

                doc
                    .fontSize(14)
                    .text(
                        `${winner.name} - ${winner.vote_count} votes`
                    );

            });

        } else if (winners.length === 1) {

            const winner = winners[0];

            doc
                .fontSize(20)
                .text("WINNER", {
                    align: "center"
                });

            doc.moveDown();


            doc
                .fontSize(18)
                .text(
                    winner.name,
                    {
                        align: "center"
                    }
                );

            doc.moveDown();


            doc
                .fontSize(14)
                .text(
                    `Party: ${winner.party_name || "Independent"}`,
                    {
                        align: "center"
                    }
                );

            doc.moveDown();


            doc
                .fontSize(16)
                .text(
                    `Votes: ${winner.vote_count}`,
                    {
                        align: "center"
                    }
                );

        }


        // =========================
        // ALL CANDIDATES
        // =========================

        doc.moveDown(3);

        doc
            .fontSize(18)
            .text("ALL CANDIDATE RESULTS");

        doc.moveDown();


        candidates.forEach((candidate, index) => {

            doc
                .fontSize(14)
                .text(
                    `${index + 1}. ${candidate.name}`
                );

            doc
                .fontSize(11)
                .text(
                    `   Party: ${candidate.party_name || "Independent"}`
                );

            doc
                .fontSize(12)
                .text(
                    `   Votes: ${candidate.vote_count}`
                );

            doc.moveDown();

        });


        // Finish PDF
        doc.end();


    } catch (error) {

        console.error(
            "Downloading results failed:",
            error
        );

        res.status(500).send(
            "Failed to download results"
        );

    }

};
module.exports = {
    showResults,
    downloadResults

};