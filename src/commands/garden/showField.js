const { SlashCommandBuilder } = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField } = require('../../garden/field');

module.exports = {
    data: new SlashCommandBuilder().setName('show').setDescription('Shows your field'),
    async execute(interaction) {
        const discordUser = interaction.user.id;
        const user = await getOrCreateUser(discordUser);
        const field = await getOrCreateField(user.id);

        let fieldString = '';
        for (let i = 0; i < field.crops.length; i++) {
            const crop = field.crops[i];
            if (crop.isGrowing) {
                fieldString += '🌱';
            } else {
                fieldString += crop.spiecies.icon;
            }
            if (i % 4 == 3) {
                fieldString += '\n';
            }
        }
        await interaction.reply({ content: fieldString });
    },
};
