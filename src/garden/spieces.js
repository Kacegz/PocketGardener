const { db } = require('../db');

module.exports = {
    getAllSpieces: async () => {
        let spieces = await db.spieces.findMany();
        return spieces;
    },
    getSpieces: async (spiecesId) => {
        let spieces = await db.spieces.findUnique({ where: { id: spiecesId } });
        return spieces;
    },
};
