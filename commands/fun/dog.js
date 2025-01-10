const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Fetches a random dog image'),
    async execute(interaction) {
        try {
            const { data } = await axios.get('https://dog.ceo/api/breeds/image/random');
            await interaction.reply(data.message || 'Could not fetch a dog image!');
        } catch (error) {
            await interaction.reply('Failed to fetch a dog image.');
        }
    },
};
