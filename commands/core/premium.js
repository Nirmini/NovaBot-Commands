const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('Info About Nova Premium.'),
    async execute(interaction) {
        const creditsEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Nova Premium Info')
            .setAuthor({ name: 'Multi 22' })
            .setThumbnail('https://i.imgur.com/nhqjXCq.png')
            .addFields(
                { name: 'Premium is the way to support Nova\'s development and it\'s developers.', value: '\u200B' },  // Added valid text here
                { name: 'Features', value: '\u200B' },
                { name: '▶ ROBLOX Moderation Integration', value: '\u200B' },
                { name: '▶ Longer storage on certain items.', value: '\u200B' },
                { name: '▶ Recognisiation as a project supporter.', value: '\u200B' },
                { name: 'Additional Info:', value: '\u200B' },
                { name: 'https://thatwest7014.github.io/nova/wiki/plus', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter({ text: 'Have an amazing rest of your day! *mewo* - Blitz' });

            await interaction.deferReply({ ephemeral: true });

            try {
                await interaction.user.send({ embeds: [creditsEmbed] });
                await interaction.editReply({
                    content: 'Sent!',
                    ephemeral: true
                });
            } catch (error) {
                console.error('Failed to send DM:', error);
                await interaction.editReply('I couldn’t DM you.');
            }
        },
    };
// This is currently canceled.