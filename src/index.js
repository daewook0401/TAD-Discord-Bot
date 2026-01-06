require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const database = require('./database/connection');
const scheduler = require('./scheduler/notificationScheduler');

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Initialize command collection
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`[INFO] Loaded command: ${command.data.name}`);
  } else {
    console.log(`[WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
  }
}

// Load event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  console.log(`[INFO] Loaded event: ${event.name}`);
}

// Initialize database connection
database.connect((err) => {
  if (err) {
    console.error('[ERROR] Failed to connect to database:', err);
    process.exit(1);
  }
  console.log('[INFO] Connected to MySQL database');
  
  // Initialize database tables
  database.initializeTables((err) => {
    if (err) {
      console.error('[ERROR] Failed to initialize database tables:', err);
      process.exit(1);
    }
    console.log('[INFO] Database tables initialized');
  });
});

// Start notification scheduler
scheduler.start(client);

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
