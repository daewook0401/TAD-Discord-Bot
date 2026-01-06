const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const partyOps = require('../database/partyOperations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party-info')
    .setDescription('Get detailed information about a party')
    .addIntegerOption(option =>
      option.setName('party-id')
        .setDescription('The ID of the party')
        .setRequired(true)),
        
  async execute(interaction) {
    const partyId = interaction.options.getInteger('party-id');
    
    try {
      // Get party details
      const party = await partyOps.getPartyById(partyId);
      
      if (!party) {
        return interaction.reply({
          content: `❌ Party with ID ${partyId} not found.`,
          ephemeral: true
        });
      }
      
      // Get party members
      const members = await partyOps.getPartyMembers(partyId);
      const scheduledTime = new Date(party.scheduled_time);
      
      const memberList = members.length > 0 
        ? members.map(m => `• ${m.username}`).join('\n')
        : 'No members yet';
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`🎉 ${party.name}`)
        .setDescription(party.description)
        .addFields(
          { name: 'Party ID', value: partyId.toString(), inline: true },
          { name: 'Scheduled Time', value: scheduledTime.toLocaleString(), inline: true },
          { name: 'Members', value: `${members.length}/${party.max_members}`, inline: true },
          { name: 'Creator', value: `<@${party.creator_id}>`, inline: true },
          { name: 'Created At', value: new Date(party.created_at).toLocaleString(), inline: true },
          { name: 'Status', value: scheduledTime > new Date() ? '✅ Active' : '⏰ Ended', inline: true },
          { name: 'Member List', value: memberList.substring(0, 1024), inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Use /party-join to join this party!' });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('[ERROR] Failed to get party info:', error);
      await interaction.reply({
        content: '❌ Failed to retrieve party information. Please try again later.',
        ephemeral: true
      });
    }
  },
};
