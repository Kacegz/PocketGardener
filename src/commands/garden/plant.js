const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require('discord.js');
const { getOrCreateUser } = require('../../garden/user');
const { getOrCreateField, plantCrop, finishCrop } = require('../../garden/field');
const { getAllSpieces, getSpieces } = require('../../garden/spieces');
module.exports = {
    data: new SlashCommandBuilder().setName('plant').setDescription('Plants a crop on your field'),
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
                //crop.spiecesId !== 0? button.setDisabled(true) : button.setDisabled(false);      // Uncomment this line to disable already planted crops
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
            content: `**Choose a field to plant a crop on**`,
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
                        content: `Cancelled planting a crop`,
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
                    const allSpieces = await getAllSpieces();
                    const spiecesSelectMenu = new StringSelectMenuBuilder()
                        .setCustomId('spiecesSelectMenu')
                        .setPlaceholder('Choose a plant to grow!')
                        .addOptions(
                            allSpieces
                                .filter((spiece) => spiece.id != 0)
                                .map((spiece) => {
                                    return new StringSelectMenuOptionBuilder()
                                        .setLabel(spiece.name)
                                        .setDescription(`50 coins and takes ${spiece.growthDuration / 1000} s`)
                                        .setValue(`${cropId} ${spiece.id}`)
                                        .setEmoji(spiece.icon);
                                })
                        );

                    const actionRow = new ActionRowBuilder().addComponents(spiecesSelectMenu);

                    await buttonInteraction.update({
                        content: `Choose a plant to grow on field ${buttonInteraction.customId}`,
                        components: [actionRow],
                    });
                }
            });

            const selectCollector = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: collectorFilter,
                time: 60_000,
            });

            selectCollector.on('collect', async (selectInteraction) => {
                const value = selectInteraction.values[0];
                const [cropId, spiecesId] = value.split(' ').map((v) => parseInt(v));

                const spieces = await getSpieces(spiecesId);
                await plantCrop(cropId, spiecesId, selectInteraction.channelId);
                selectInteraction.update({
                    content: `Planted crop ${spiecesId} on field ${cropId}, done in ${spieces.growthDuration / 1000} s`,
                    components: [],
                });

                setTimeout(async () => {
                    await finishCrop(cropId);
                    await selectInteraction.followUp({
                        content: 'hehe',
                        ephemeral: true,
                    });
                }, spieces.growthDuration);
            });
        } catch (e) {
            await interaction.editReply({
                content: `error ${e}`, //'Confirmation not received within 1 minute, cancelling 🧑‍🌾',
                components: [],
            });
        }
    },
};
