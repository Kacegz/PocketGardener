const { db } = require('../db');

module.exports = {
    getOrCreateField: async (userId) => {
        let field = await db.field.findUnique({
            where: { userId: userId },
            include: { crops: { include: { spiecies: true } } },
        });
        if (!field) {
            let defaultCrops = Array(20).fill({ spiecesId: 0 });
            field = await db.field.create({
                data: {
                    userId: userId,
                    crops: {
                        create: defaultCrops,
                    },
                },
                include: { crops: { include: { spiecies: true } } },
            });
        }
        return field;
    },
    plantCrop: async (cropId, newSpieciesId) => {
        await db.crop.update({
            where: { id: cropId },
            data: { spiecesId: newSpieciesId, isGrowing: true, plantedTime: new Date() },
        });
    },
    finishCrop: async (cropId) => {
        await db.crop.update({
            where: { id: cropId },
            data: { isGrowing: false },
        });
    },
};
