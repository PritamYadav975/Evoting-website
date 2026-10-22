const createCandidate = async (
    connection,
    electionId,
    partyId,
    name,
    image,
    position,
    constituency
) => {

    const sql = `
        INSERT INTO candidates
        (
            election_id,
            party_id,
            name,
            image,
            position,
            constituency
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
        electionId,
        partyId,
        name,
        image,
        position,
        constituency
    ]);

    return result;
};

const getCandidatesWithVoteCounts = async (connection, electionId) => {
    const sql = `
        SELECT
            candidates.id,
            candidates.name,
            candidates.image,
            candidates.position,
            candidates.constituency,
            parties.name AS party_name,
            parties.symbol_image,
            COUNT(votes.id) AS vote_count
        FROM candidates
        LEFT JOIN parties
            ON candidates.party_id = parties.id
        LEFT JOIN votes
            ON votes.candidate_id = candidates.id
            AND votes.election_id = candidates.election_id
        WHERE candidates.election_id = ?
        GROUP BY
            candidates.id,
            candidates.name,
            candidates.image,
            candidates.position,
            candidates.constituency,
            parties.name,
            parties.symbol_image
        ORDER BY vote_count DESC
    `;

    const [candidates] = await connection.query(sql, [electionId]);

    return candidates;
};

module.exports = {
    createCandidate,
    getCandidatesWithVoteCounts
};