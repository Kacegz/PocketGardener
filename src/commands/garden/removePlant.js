const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField, removeCrop } = require('../../garden/field');
module.exports = {
    data: new SlashCommandBuilder().setName('remove').setDescription('Removes a crop from your field'),
    async execute(interaction) {
        const user = await getOrCreateUser(interaction.user.id);
        const field = await getOrCreateField(user.id);

        let rows = [];
        let crops = [];
        for (let i = 0; i < field.crops.length; i++) {
            const crop = field.crops[i];
            if (crop.isGrowing) {
                const growingButton = new ButtonBuilder()
                    .setCustomId(`crop${crop.id}`)
                    .setEmoji('🌱')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);
                crops.push(growingButton);
            } else {
                const icon = crop.spiecies.icon;
                const button = new ButtonBuilder()
                    .setCustomId(`crop${crop.id}`)
                    .setEmoji(icon)
                    .setStyle(ButtonStyle.Secondary);
                crop.spiecesId == 0 ? button.setDisabled(true) : button.setDisabled(false); // allow removal for crops not grown
                crops.push(button);
            }
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
            content: `**Choose a field to remove a crop from**`,
            //ephemeral: true,
            components: [...rows, lastRow],
        });

        try {
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            const buttonCollector = response.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: collectorFilter,
                time: 60_000,
            });

            buttonCollector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'cancel') {
                    await buttonInteraction.update({
                        content: `Cancelled removing a crop`,
                        components: [],
                    });
                } else if (buttonInteraction.customId === 'previous') {
                    await buttonInteraction.update({
                        content: 'Going back to previous field...',
                        components: [],
                    });
                } else if (buttonInteraction.customId === 'next') {
                    await buttonInteraction.update({
                        content: 'Going to the next field...',
                        components: [],
                    });
                } else if (buttonInteraction.customId.startsWith('crop')) {
                    const cropId = parseInt(buttonInteraction.customId.slice(4));

                    await removeCrop(cropId, buttonInteraction.channelId);
                    buttonInteraction.update({
                        content: `Removed a crop on field ${cropId}`,
                        components: [],
                    });
                }
            });
        } catch (e) {
            await interaction.editReply({
                content: `error ${e}`, //'Confirmation not received within 1 minute, cancelling 🧑‍🌾',
                components: [],
            });
        }
    },
};
