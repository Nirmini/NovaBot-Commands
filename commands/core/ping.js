const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('View the bot\'s latency'),
    async execute(interaction) {
        const latency = interaction.client.ws.ping;
        await interaction.reply(`Pong! \`${latency}ms\``);
    },
};
