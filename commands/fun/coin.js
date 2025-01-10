const { SlashCommandBuilder, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Flip a coin and see the result!'),
    async execute(interaction) {
        try {
            // Randomly pick Heads or Tails
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

            // Create an embed for the response
            const embed = new MessageEmbed()
                .setColor('#FFD700') // Gold color
                .setTitle('Coin Flip')
                .setDescription(`The coin landed on **${result}**! 🪙`)
                .setFooter({ text: 'Feeling lucky?', iconURL: interaction.user.displayAvatarURL() });

            // Send the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing /coin command:', error);
            await interaction.reply({ content: 'An error occurred while flipping the coin. Please try again later.', ephemeral: true });
        }
    },
};
