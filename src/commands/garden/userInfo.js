const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField } = require('../../garden/field');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Shows info about the user')
        .addUserOption((option) =>
            option.setName('user').setDescription('Nickname of user to show their info').setRequired(true)
        ),
    async execute(interaction) {
        const discordUser = interaction.options.getUser('user');
        const user = await getOrCreateUser(discordUser.id);
        const field = await getOrCreateField(user.id);
        let fieldString = '';
        for (let i = 0; i < field.crops.length; i++) {
            const crop = field.crops[i];
            if (crop.isGrowing) {
                fieldString += '🌱';
            } else {
                fieldString += crop.spiecies.icon;
            }
            if (i % 5 == 4) {
                fieldString += '\n';
            }
        }
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({ name: discordUser.globalName + "'s farm", iconURL: discordUser.displayAvatarURL() })
            .addFields({ name: 'Balance:', value: '0' })
            //.setDescription('Some description here')
            .addFields({ name: 'Field:', value: fieldString })
            .setTimestamp();

        interaction.reply({ embeds: [exampleEmbed] });
    },
};
