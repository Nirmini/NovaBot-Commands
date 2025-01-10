const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
const robloxApp = admin.initializeApp(
    {
        credential: admin.credential.cert(require('../../keys/roblox-serviceAccountKey.json')),
        databaseURL: 'YOUR_FIREBASE_RTDB_URL_HERE',
    },
    'RobloxApp'
);
const robloxDB = getDatabase(robloxApp);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rblx')
        .setDescription('Manage Roblox warnings and bans')
        .addSubcommand(subcommand =>
            subcommand
                .setName('warn')
                .setDescription('Warn a Roblox user')
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setDescription('Roblox User ID')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Reason for the warning')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('ban')
                .setDescription('Ban a Roblox user')
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setDescription('Roblox User ID')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Reason for the ban')
                        .setRequired(true))),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                await interaction.reply({
                    content: '❌ You lack the permissions to use this command.',
                    ephemeral: true,
                });
                return;
            }
            const subcommand = interaction.options.getSubcommand();
            const userId = interaction.options.getString('userid');
            const reason = interaction.options.getString('reason');
            const mod = interaction.user.tag;
            const timestamp = new Date().toISOString();
            if (subcommand === 'warn') {
                const warningsPath = `warnings/${userId}`;
                const snapshot = await robloxDB.ref(warningsPath).get();
                const warnings = snapshot.exists() ? snapshot.val() : [];
                warnings.push({ reason, mod, timestamp });
                await robloxDB.ref(warningsPath).set(warnings);
                await interaction.reply({
                    content: `✅ Warned Roblox user \`${userId}\` for: **${reason}**`,
                    ephemeral: true,
                });
            } else if (subcommand === 'ban') {
                const banPath = `bans/${userId}`;
                await robloxDB.ref(banPath).set({ reason, mod, timestamp });

                await interaction.reply({
                    content: `✅ Banned Roblox user \`${userId}\` for: **${reason}**`,
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error('Error executing /rblx command:', error);
            await interaction.reply({
                content: '❌ An error occurred while executing this command.',
                ephemeral: true,
            });
        }
    },
};
