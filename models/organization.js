const db = require("../config/db");

const getAllOrganizations = async () => {
    const [rows] = await db.query("SELECT * FROM organizations");
    return rows;
};
const createOrganization = async (
    name,
    username,
    email,
    passwordHash,
    resultsPasswordHash
) => {
    const sql = `
        INSERT INTO organizations
        (name, username, email, password_hash, results_password_hash)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        name,
        username,
        email,
        passwordHash,
        resultsPasswordHash
    ]);

    return result;
};
const getOrganizationByUsername = async (username) => {
    const sql = `
        SELECT *
        FROM organizations
        WHERE username = ?
    `;

    const [rows] = await db.query(sql, [username]);

    return rows[0];
};
module.exports = {
    getAllOrganizations,
    createOrganization,
    getOrganizationByUsername
};
