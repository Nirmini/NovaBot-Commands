const { SlashCommandBuilder, WebhookClient } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug')
        .setDescription('Send a report to the NDT.')
        .addStringOption(option =>
        option
                .setName('bugdesc')
                .setDescription('Describe the bug here.')
                .setRequired(true)),
    async execute(interaction) {
        const webhookURL = 'https://ptb.discord.com/api/webhooks/1325598669461913676/IMD_ky0KgTfx8-XQyP5301QN59VlMgaLMDIRkLl5myG6nrDI17_M-DQkZRNEty6oDg3m';
        const webhookClient = new WebhookClient({ url: webhookURL });

        const user = interaction.user;
        const guild = interaction.guild;
        const bugreport = interaction.options.getString('bugdesc') || '';

        if (bugreport.length > 80) {
            interaction.reply({ content:'You\'re description is too long. Please try to shorten it or report it directly.', ephemeral: true});
            return;
        }

        // Format the report message
        const bugreportmsg = `\`${user.username} (@${user.id})\` reported a bug with the description \`${bugreport}\`.`;

        try {
            // Send the message to the webhook
            await webhookClient.send({ content: bugreportmsg });

            // Acknowledge the report
            await interaction.reply({ content: '✅ Your report has been submitted.', ephemeral: true });
        } catch (error) {
            console.error('Error sending report via webhook:', error);
            await interaction.reply({ content: '❌ Failed to submit your report. Please try again later.', ephemeral: true });
        }
    },
};
