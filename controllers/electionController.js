const db = require("../config/db");

const electionModel = require("../models/electionModel");
const partyModel = require("../models/partyModel");
const candidateModel = require("../models/candidateModel");

const createElection = async (req, res) => {

    let connection;

    try {

        connection = await db.getConnection();

        await connection.beginTransaction();

        const {
            name,
            category,
            startTime,
            endTime
        } = req.body;

        const organizationId = req.session.user.id;

        // Create election
        const electionResult =
            await electionModel.createElection(
                connection,
                organizationId,
                name,
                category,
                startTime,
                endTime
            );

        const electionId =
            electionResult.insertId;


        // =========================
        // CREATE PARTIES
        // =========================

        const partyNames =
            req.body.partyName || [];

        const partySymbols =
            req.files["partySymbol[]"] || [];

        const partyIds = [];

        for (let i = 0; i < partyNames.length; i++) {

            const partyName =
                partyNames[i];

            if (
                !partyName ||
                partyName.trim() === ""
            ) {
                partyIds.push(null);
                continue;
            }

            const symbolImage =
                partySymbols[i]
                    ? partySymbols[i].path
                    : null;

            const isIndependent =
                partyName.toLowerCase() === "independent";

            const partyResult =
                await partyModel.createParty(
                    connection,
                    organizationId,
                    partyName,
                    symbolImage,
                    isIndependent
                );

            partyIds.push(
                partyResult.insertId
            );
        }


        // =========================
        // CREATE CANDIDATES
        // =========================

        const candidateNames =
            req.body.candidateName || [];

        const candidateParties =
            req.body.candidateParty || [];

        const candidatePositions =
            req.body.candidatePosition || [];

        const candidateConstituencies =
            req.body.candidateConstituency || [];

        const candidateImages =
            req.files["candidateImage[]"] || [];


        for (
            let i = 0;
            i < candidateNames.length;
            i++
        ) {

            if (
                !candidateNames[i] ||
                candidateNames[i].trim() === ""
            ) {
                continue;
            }


            const selectedParty =
                candidateParties[i];

            let partyId = null;


            if (
                selectedParty &&
                selectedParty !== "INDEPENDENT"
            ) {

                const partyIndex =
                    partyNames.indexOf(selectedParty);

                if (partyIndex !== -1) {

                    partyId =
                        partyIds[partyIndex];

                }
            }


            const image =
                candidateImages[i]
                    ? candidateImages[i].path
                    : null;


            await candidateModel.createCandidate(
                connection,
                electionId,
                partyId,
                candidateNames[i],
                image,
                candidatePositions[i],
                candidateConstituencies[i]
            );

        }


        // =========================
        // SAVE EVERYTHING
        // =========================

        await connection.commit();

        console.log(
            "Election created successfully:",
            electionId
        );


        req.flash("success", "Election setup completed successfully.");

        // Go directly to voting page
        res.redirect(
            `/voting/${electionId}`
        );


    } catch (error) {

        console.error(
            "Election creation failed:",
            error
        );

        if (connection) {
            await connection.rollback();
        }

        req.flash("error", "Failed to start election. Please try again.");
        return res.redirect("/elections/create");


    } finally {

        if (connection) {
            connection.release();
        }

    }

};


module.exports = {
    createElection
};