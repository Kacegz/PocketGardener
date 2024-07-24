const { SlashCommandBuilder } = require("discord.js");
const { getOrCreateUser } = require("../../garden/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Check your internal user id"),
  async execute(interaction) {
    const discordUser = interaction.user.id;
    const user = await getOrCreateUser(discordUser);
    await interaction.reply({
      content: `Your id is ${user.id}. Your discord id is ${user.discord_id}`,
      ephemeral: true,
    });
  },
};
