const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { db, ref, get, update } = require('../../src/firebase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delwarn')
        .setDescription('Delete a specific warning from a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to delete warning from')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('warn_number')
                .setDescription('The warning number to delete')
                .setRequired(true)),
    async execute(interaction) {
        try {
            console.log('Checking permissions...');
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            console.log('Fetching user and warning number...');
            const user = interaction.options.getUser('user');
            const warnNumber = interaction.options.getInteger('warn_number');
            const userId = user.id;
            const guildId = interaction.guildId;

            console.log(`User: ${userId}, Guild: ${guildId}, WarnNumber: ${warnNumber}`);
            
            const userWarningsRef = ref(db, `${guildId}/warnings/${userId}`);
            const snapshot = await get(userWarningsRef);

            if (!snapshot.exists()) {
                await interaction.reply({ content: 'This user has no warnings.', ephemeral: true });
                return;
            }

            let warnings = snapshot.val();

            if (warnNumber < 1 || warnNumber > warnings.length) {
                await interaction.reply({ content: 'Invalid warning number.', ephemeral: true });
                return;
            }

            warnings.splice(warnNumber - 1, 1); // Remove the specific warning

            const updates = {};
            updates[`warnings/${userId}/${guildId}`] = warnings;

            console.log('Updating database...');
            await update(ref(db), updates);

            await interaction.reply({ content: `Warning #${warnNumber} for ${user.tag} has been deleted.`, ephemeral: false });
        } catch (error) {
            console.error('Error deleting warning:', error);
            await interaction.reply({ content: 'There was an error deleting the warning. Please try again later.', ephemeral: true });
        }
    },
};
