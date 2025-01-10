const { ChannelType, SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Initial bot setup for the server.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('roles')
                .setDescription('Create necessary roles for moderation.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channels')
                .setDescription('Set up required channels for logs and moderation.')),
    async execute(interaction) {
        try {
            // Ensure the user has Manage Guild permissions
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'roles') {
                await setupRoles(interaction);
            } else if (subcommand === 'channels') {
                await setupChannels(interaction);
            }
        } catch (error) {
            console.error('Error during setup execution:', error);
            await interaction.reply({ content: 'An error occurred while processing the setup.', ephemeral: true });
        }
    },
};

async function setupRoles(interaction) {
    const guild = interaction.guild;

    const rolesToCreate = [
        { name: 'Moderator', color: 0x0000FF, permissions: [PermissionsBitField.Flags.ModerateMembers] },
        { name: 'Admin', color: 0xFF0000, permissions: [PermissionsBitField.Flags.Administrator] },
        { name: 'Muted', color: 0x808080, permissions: [] }
    ];

    const createdRoles = [];
    for (const roleData of rolesToCreate) {
        const existingRole = guild.roles.cache.find(r => r.name === roleData.name);
        if (!existingRole) {
            const role = await guild.roles.create({
                name: roleData.name,
                color: roleData.color,
                permissions: roleData.permissions,
                reason: 'Setup command: creating necessary roles.',
            });
            createdRoles.push(role);
        } else {
            createdRoles.push(existingRole);
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('Roles Setup Complete')
        .setColor(0x00ff00)
        .setDescription('The following roles were created or verified:')
        .addFields(createdRoles.map(role => ({ name: role.name, value: `ID: ${role.id}`, inline: true })))
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

// Function to handle channel setup
async function setupChannels(interaction) {
    const guild = interaction.guild;

    const channelsToCreate = [
        { name: 'mod-logs', type: ChannelType.GuildText, reason: 'Setup command: creating moderation log channel.' },
        { name: 'general-chat', type: ChannelType.GuildText, reason: 'Setup command: creating general chat channel.' },
    ];

    const createdChannels = [];
    for (const channelData of channelsToCreate) {
        const existingChannel = guild.channels.cache.find(c => c.name === channelData.name);
        if (!existingChannel) {
            const channel = await guild.channels.create({
                name: channelData.name,
                type: channelData.type,
                reason: channelData.reason,
            });
            createdChannels.push(channel);
        } else {
            createdChannels.push(existingChannel);
        }
    }

    const embed = new EmbedBuilder()
        .setTitle('Channels Setup Complete')
        .setColor(0x00ff00)
        .setDescription('The following channels were created or verified:')
        .addFields(createdChannels.map(channel => ({ name: channel.name, value: `ID: ${channel.id}`, inline: true })))
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}