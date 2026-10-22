const createVote = async (
    connection,
    electionId,
    candidateId
) => {

    const sql = `
        INSERT INTO votes
        (election_id, candidate_id)
        VALUES (?, ?)
    `;

    const [result] = await connection.query(sql, [
        electionId,
        candidateId
    ]);

    return result;
};

module.exports = {
    createVote
};