const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Multi Credits.'),
    async execute(interaction) {
        const creditsEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Nova Credits')
            .setAuthor({ name: 'Nova' })
            .setThumbnail('https://i.imgur.com/nhqjXCq.png')
            .addFields(
                { name: '**MAIN LIBRARIES**', value: '\u200B' },
                { name: 'Discord.js', value: 'We use Discord.js to host and manage the bot'},
                { name: 'Firebase', value: 'We use Firebase to provide reliable infustrcture for our users.'},
                { name: 'Node.js', value: 'We ustilize Node.js to host the bot and other key operations due to it\'s simplicity and reliabiltiy.'},
                { name: 'axios', value: 'We use Axios to handle API calls and HTTP requests'},
                { name: 'dotenv', value: 'We also use dotenv to be able to have a more secure application.'},
                { name: 'Express.js', value: 'We use Express.js to handle the dashboard aswell as other web-server operations.'},
                { name: 'Noblox.js', value: 'We use Noblox to allow for an easy and simple authentication for server admins and members.'},
                { name: 'js-yaml', value: 'We used js-yaml to be able to have different configurations for the bot.'},
                { name: 'Cheerio', value: 'We use Cheerio mainly as a fallback to Noblox.'},
                { name: 'cloudflare', value: 'We use this to provide cloudflare functions in the application.'},
                { name: 'googleapis', value: 'We use this to be able to use multiple Google APIs'},
                { name: 'ms', value: 'We use ms to handle time conversions in user inputs.'},
                { name: 'stripe', value: 'We use Stripe to handle premium payments and such.'},
                { name: '\u200B', value: '\u200B' },
                { name: '**QHDT CONTRIBUTORS**', value: '\u200B' },
                { name: 'Frost', value: 'Lead Maintainer & Project Founder', inline: true },
                { name: 'Quantum Horizon Dev Group', value: 'Ovrsight', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: '**OUTSIDE CONTRIBUTORS**', value: '\u200B' },
                { name: 'Zacharyeb17', value: 'Ex-Project Feedback', inline: true },
                { name: '.Aaron227', value: 'Project Feedback', inline: true },
                { name: '\u200B', value: '\u200B' }
            )
            .setTimestamp()
            .setFooter({ text: '\"Unbound.\"' });

        await interaction.reply({ embeds: [creditsEmbed] });
    },
};
