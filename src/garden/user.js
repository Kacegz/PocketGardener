const { db } = require("../db")

module.exports = {
    getOrCreateUser: async (discordId) => {
        let user = await db.user.findUnique({ where: { discord_id: discordId } })
        if (!user) {
            user = await db.user.create({
                data: {
                    discord_id: discordId,
                }
            })
        }
        return user
    }
}