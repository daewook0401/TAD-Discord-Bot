const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`[INFO] Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`[INFO] Serving ${client.guilds.cache.size} guild(s)`);
    
    // Set bot status
    client.user.setActivity('party commands | /help', { type: ActivityType.Watching });
  },
};
