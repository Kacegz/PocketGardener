const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('Shows your field.'),
	async execute(interaction) {
		const field=`🟫🟫🟫🟫\n🟫🟫🟫🟫\n🟫🟫🟫🟫\n🟫🟫🟫🟫`
		await interaction.reply(field);
	},
};
