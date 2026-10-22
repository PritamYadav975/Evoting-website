const createParty = async (
    connection,
    organizationId,
    name,
    symbolImage,
    isIndependent
) => {

    const sql = `
        INSERT INTO parties
        (
            organization_id,
            name,
            symbol_image,
            is_independent
        )
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [
        organizationId,
        name,
        symbolImage,
        isIndependent
    ]);

    return result;
};

module.exports = {
    createParty
};