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
    plantCrop: async (cropId, newSpieciesId, channelId) => {
        console.log(channelId);
        await db.crop.update({
            where: { id: cropId },
            data: { spiecesId: newSpieciesId, isGrowing: true, plantedTime: new Date(), replyChannel: channelId },
        });
    },
    finishCrop: async (cropId) => {
        return await db.crop.update({
            where: { id: cropId },
            data: { isGrowing: false },
        });
    },
    getUserForCrop: async (cropId) => {
        return await db.crop.findUnique({
            where: { id: cropId },
            include: { field: { include: { user: true } } },
        });
    },
};
