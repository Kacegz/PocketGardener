const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField, plantCrop } = require('../../garden/field');
let previousMessage = null;
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
            //crop.spiecesId == 1 ? button.setDisabled(true) : button.setDisabled(false);      // Uncomment this line to disable already planted crops
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
        if (previousMessage) {
            await previousMessage.delete();
        }
        const response = await interaction.reply({
            content: `**Choose a field to plant a crop on**`,
            components: [...rows, lastRow],
        });
        previousMessage = response;
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            if (confirmation.customId === 'cancel') {
                await confirmation.update({
                    content: `Cancelled planting a crop`,
                    components: [],
                });
                previousMessage = null;
            } else if (confirmation.customId === 'previous') {
                await confirmation.update({
                    content: 'Going back to previous field...',
                    components: [],
                });
            } else if (confirmation.customId === 'next') {
                await confirmation.update({
                    content: 'Going to the next field...',
                    components: [],
                });
            } else {
                const cropId = parseInt(confirmation.customId);
                const spiecesId = 1;
                await plantCrop(cropId, spiecesId);
                await confirmation.update({
                    content: `Successfully planted crop ${spiecesId} on field ${confirmation.customId}`,
                    components: [],
                });
                previousMessage = null;
            }
        } catch (e) {
            await interaction.editReply({
                content: 'Confirmation not received within 1 minute, cancelling 🧑‍🌾',
                components: [],
            });
        }
    },
};
