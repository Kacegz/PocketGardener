const { SlashCommandBuilder } = require('discord.js');
async function fetchDog() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const dog = await response.json();
    return dog;
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sends a random gif!')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('The gif category')
                .setRequired(true)
                .addChoices(
                    { name: 'FunnyDawg', value: 'dog' },
                    { name: 'FunnyCat', value: 'cat' },
                    { name: 'secret🫢🫢🫢', value: 'secret' }
                )
        ),
    async execute(interaction) {
        const choice = interaction.options.getString('category');
        if (choice == 'dog') {
            const dog = await fetchDog();
            await interaction.reply(`the dawg \n${dog.message}`);
        } else if (choice == 'cat') {
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const cat = await response.json();
            await interaction.reply(`KICIUSIE\n${cat[0].url}`);
        } else if (choice == 'secret') {
            const response = await fetch('https://api.capy.lol/v1/capybara?json=true');
            const secret = await response.json();
            await interaction.reply(`cute cappy 😍😍🥰🥰\n${secret.data.alt}\n${secret.data.url}`);
        }
    },
};
