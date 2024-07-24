const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('plant').setDescription('Plants a crop on your field'),
    async execute(interaction) {
        const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('cancel').setStyle(ButtonStyle.Danger);
        const first = new ButtonBuilder().setCustomId('1').setLabel('🟫').setStyle(ButtonStyle.Secondary);
        const second = new ButtonBuilder().setCustomId('2').setEmoji('🟫').setStyle(ButtonStyle.Secondary);
        const next = new ButtonBuilder().setCustomId('next').setLabel('>').setStyle(ButtonStyle.Success);

        const example = new ButtonBuilder().setCustomId('e').setLabel('e').setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(cancel, first, second, next);
        const row2 = new ActionRowBuilder().addComponents(example);
        const response = await interaction.reply({
            content: `Are you sure you want to plant a crop on your field?`,
            components: [row, row2],
        });
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (confirmation.customId === 'cancel') {
                await confirmation.update({
                    content: `cancelled`,
                    components: [],
                });
            } else if (confirmation.customId === 'next') {
                await confirmation.update({
                    content: 'Skipping to another field',
                    components: [],
                });
            } else {
                await confirmation.update({
                    content: `Planting crop on field ${confirmation.customId}`,
                    components: [],
                });
            }
        } catch (e) {
            await interaction.editReply({
                content: 'Confirmation not received within 1 minute, cancelling',
                components: [],
            });
        }
    },
};
