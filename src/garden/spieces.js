const { db } = require('../db');

module.exports = {
    getAllSpieces: async () => {
        let spieces = await db.spieces.findMany();
        return spieces;
    },
};
