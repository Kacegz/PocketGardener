const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('help').setDescription('Shows help info'),
    async execute(interaction) {
        await interaction.reply({
            content: `This is a help message`,
        });
    },
};
