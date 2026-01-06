const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const partyOps = require('../database/partyOperations');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party-leave')
    .setDescription('Leave a party you joined')
    .addIntegerOption(option =>
      option.setName('party-id')
        .setDescription('The ID of the party to leave')
        .setRequired(true)),
        
  async execute(interaction) {
    const partyId = interaction.options.getInteger('party-id');
    
    try {
      // Check if party exists
      const party = await partyOps.getPartyById(partyId);
      
      if (!party) {
        return interaction.reply({
          content: `❌ Party with ID ${partyId} not found.`,
          ephemeral: true
        });
      }
      
      // Check if user is a member
      const isMember = await partyOps.isPartyMember(partyId, interaction.user.id);
      
      if (!isMember) {
        return interaction.reply({
          content: '❌ You are not a member of this party!',
          ephemeral: true
        });
      }
      
      // Remove user from party
      await partyOps.removePartyMember(partyId, interaction.user.id);
      
      const memberCount = await partyOps.getPartyMemberCount(partyId);
      
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('👋 Left Party')
        .setDescription(`You've left **${party.name}**`)
        .addFields(
          { name: 'Party ID', value: partyId.toString(), inline: true },
          { name: 'Remaining Members', value: memberCount.toString(), inline: true }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('[ERROR] Failed to leave party:', error);
      await interaction.reply({
        content: '❌ Failed to leave party. Please try again later.',
        ephemeral: true
      });
    }
  },
};
