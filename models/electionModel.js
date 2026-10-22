const db = require("../config/db");

const createElection = async (
    connection,
    organizationId,
    name,
    category,
    startTime,
    endTime
) => {
    const sql = `
        INSERT INTO elections
        (organization_id, name, category, start_time, end_time)
        VALUES (?, ?, ?, ?, ?)
    `;

   const [result] = await connection.query(sql, [
    organizationId,
        name,
        category,
        startTime,
        endTime
    ]);

    return result;
};

module.exports = {
    createElection
};