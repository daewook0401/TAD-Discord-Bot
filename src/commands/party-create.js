const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const partyOps = require('../database/partyOperations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party-create')
    .setDescription('Create a new party')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Party name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Scheduled time (format: YYYY-MM-DD HH:MM)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Party description')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('max-members')
        .setDescription('Maximum number of members (default: 10)')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(100)),
        
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const timeStr = interaction.options.getString('time');
    const description = interaction.options.getString('description') || 'No description provided';
    const maxMembers = interaction.options.getInteger('max-members') || 10;
    
    // Parse and validate time
    const scheduledTime = new Date(timeStr);
    
    if (isNaN(scheduledTime.getTime())) {
      return interaction.reply({
        content: '❌ Invalid time format. Please use: YYYY-MM-DD HH:MM (e.g., 2024-12-31 20:00)',
        ephemeral: true
      });
    }
    
    if (scheduledTime <= new Date()) {
      return interaction.reply({
        content: '❌ Scheduled time must be in the future!',
        ephemeral: true
      });
    }
    
    try {
      // Create party in database
      const partyId = await partyOps.createParty({
        name,
        description,
        scheduledTime,
        maxMembers,
        creatorId: interaction.user.id,
        guildId: interaction.guildId
      });
      
      // Add creator as first member
      await partyOps.addPartyMember(partyId, interaction.user.id, interaction.user.username);
      
      // Create notification (1 hour before party)
      const notificationTime = new Date(scheduledTime.getTime() - 60 * 60 * 1000);
      if (notificationTime > new Date()) {
        await partyOps.createNotification(partyId, notificationTime);
      }
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎉 Party Created!')
        .setDescription(`**${name}** has been created successfully!`)
        .addFields(
          { name: 'Party ID', value: partyId.toString(), inline: true },
          { name: 'Scheduled Time', value: scheduledTime.toLocaleString(), inline: true },
          { name: 'Max Members', value: maxMembers.toString(), inline: true },
          { name: 'Description', value: description },
          { name: 'Creator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Current Members', value: '1', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Use /party-join ${partyId} to join this party!` });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('[ERROR] Failed to create party:', error);
      await interaction.reply({
        content: '❌ Failed to create party. Please try again later.',
        ephemeral: true
      });
    }
  },
};
