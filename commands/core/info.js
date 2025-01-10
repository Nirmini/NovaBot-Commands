const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Info About Nova.'),
    async execute(interaction) {
        const creditsEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Nova Information')
            .setAuthor({ name: 'Nova 22' })
            .setThumbnail('https://i.imgur.com/nhqjXCq.png')
            .addFields(
                { name: '**What is Nova?**', value: '\u200B' },
                { name: '\u200B', value: 'Nova is a moderation bot that also is flexible.', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '\u200B', value: 'Please see \`/setup\` in assistance in setting up Nova.', inline: true },
                { name: '\u200B', value: '\u200B' }
            )
            .setTimestamp()
            .setFooter({ text: 'Have an amazing rest of your day! *mewo* - Blitz' });

        await interaction.user.send({ embeds: [creditsEmbed] });
    },
};
