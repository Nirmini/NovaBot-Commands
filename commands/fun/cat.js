const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Fetches a random cat image'),
    async execute(interaction) {
        try {
            const { data } = await axios.get('https://api.thecatapi.com/v1/images/search');
            await interaction.reply(data[0]?.url || 'Could not fetch a cat image!');
        } catch (error) {
            await interaction.reply('Failed to fetch a cat image.');
        }
    },
};
