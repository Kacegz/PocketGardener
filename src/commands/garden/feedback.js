const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('feedback').setDescription('Shows info how to give feedback'),
    async execute(interaction) {
        await interaction.reply({
            content: `Hey! If you have any feedback or suggestions, please ping`,
            ephemeral: true,
        });
    },
};
