const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField, plantCrop } = require('../../garden/field');

module.exports = {
    data: new SlashCommandBuilder().setName('plant').setDescription('Plants a crop on your field'),
    async execute(interaction) {
        const user = await getOrCreateUser(interaction.user.id);
        const field = await getOrCreateField(user.id);

        let rows = [];
        let crops = [];
        for (let i = 0; i < field.crops.length; i++) {
            const crop = field.crops[i];
            const icon = crop.spiecies.icon;
            const button = new ButtonBuilder()
                .setCustomId(crop.id.toString())
                .setEmoji(icon)
                .setStyle(ButtonStyle.Secondary);
            crops.push(button);
            if (i % 5 == 4) {
                const row = new ActionRowBuilder().addComponents(crops);
                crops = [];
                rows.push(row);
            }
        }

        const previous = new ButtonBuilder().setCustomId('previous').setEmoji('👈').setStyle(ButtonStyle.Primary);
        const blank1 = new ButtonBuilder()
            .setCustomId('blank1')
            .setLabel('-')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        const cancel = new ButtonBuilder().setCustomId('cancel').setEmoji('🙅').setStyle(ButtonStyle.Danger);
        const blank2 = new ButtonBuilder()
            .setCustomId('blank2')
            .setLabel('-')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        const next = new ButtonBuilder().setCustomId('next').setEmoji('👉').setStyle(ButtonStyle.Primary);
        const lastRow = new ActionRowBuilder().addComponents(previous, blank1, cancel, blank2, next);

        const response = await interaction.reply({
            content: `Are you sure you want to plant a crop on your field?`,
            components: [...rows, lastRow],
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
                const cropId = parseInt(confirmation.customId);
                const spiecesId = 1;
                await plantCrop(cropId, spiecesId);
                await confirmation.update({
                    content: `Planting crop ${spiecesId} on field ${confirmation.customId}`,
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
