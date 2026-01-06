# TAD-Discord-Bot

A production-ready Discord bot built with Node.js and discord.js that provides party scheduling and management features with automated time-based notifications.

## Features

- 🎉 **Party Scheduling System**: Create, join, and leave parties with scheduled times
- 🔔 **Automated Notifications**: Time-based reminders sent 1 hour before parties start
- ⚡ **Slash Commands**: Modern Discord slash command interactions
- 🗄️ **MySQL Database**: Persistent storage for parties and members
- 📦 **Modular Architecture**: Clean separation of concerns with extensible structure
- 🔧 **Easy Configuration**: Environment-based configuration with .env file

## Commands

| Command | Description |
|---------|-------------|
| `/party-create` | Create a new party with name, time, description, and max members |
| `/party-join` | Join an existing party by ID |
| `/party-leave` | Leave a party you've joined |
| `/party-list` | List all active parties in the server |
| `/party-info` | Get detailed information about a specific party |
| `/help` | Display all available commands |
| `/ping` | Check bot latency and status |

## Project Structure

```
TAD-Discord-Bot/
├── src/
│   ├── commands/           # Slash command handlers
│   │   ├── party-create.js
│   │   ├── party-join.js
│   │   ├── party-leave.js
│   │   ├── party-list.js
│   │   ├── party-info.js
│   │   ├── help.js
│   │   └── ping.js
│   ├── events/            # Discord event handlers
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── database/          # Database layer
│   │   ├── connection.js
│   │   └── partyOperations.js
│   ├── scheduler/         # Notification scheduler
│   │   └── notificationScheduler.js
│   ├── utils/             # Utility functions
│   ├── deploy-commands.js # Command deployment script
│   └── index.js           # Main bot entry point
├── .env.example           # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js 16.11.0 or higher
- MySQL 5.7 or higher
- Discord Bot Token and Application

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/daewook0401/TAD-Discord-Bot.git
cd TAD-Discord-Bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MySQL Database

Create a new MySQL database:

```sql
CREATE DATABASE tad_discord_bot;
```

The bot will automatically create the required tables on first run:
- `parties` - Stores party information
- `party_members` - Stores party membership data
- `notifications` - Stores notification scheduling data

### 4. Configure Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT (optional)
5. Copy the bot token
6. Go to "OAuth2" > "URL Generator"
7. Select scopes: `bot` and `applications.commands`
8. Select bot permissions: `Send Messages`, `Embed Links`, `Read Messages/View Channels`
9. Copy the generated URL and invite the bot to your server

### 5. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_discord_guild_id_here

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=tad_discord_bot

NOTIFICATION_CHANNEL_ID=your_notification_channel_id_here
```

**Finding IDs:**
- **DISCORD_CLIENT_ID**: Found in Discord Developer Portal > Your Application > General Information > Application ID
- **DISCORD_GUILD_ID**: Right-click your server in Discord and select "Copy ID" (enable Developer Mode in Discord settings first)
- **NOTIFICATION_CHANNEL_ID**: Right-click the channel where notifications should be sent and select "Copy ID"

### 6. Deploy Slash Commands

Deploy commands to your Discord server:

```bash
npm run deploy-commands
```

### 7. Start the Bot

#### Production Mode:
```bash
npm start
```

#### Development Mode (with auto-restart):
```bash
npm run dev
```

## Usage Example

1. **Create a Party**:
   ```
   /party-create name:"Game Night" time:"2024-12-31 20:00" description:"Let's play together!" max-members:5
   ```

2. **List Parties**:
   ```
   /party-list
   ```

3. **Join a Party**:
   ```
   /party-join party-id:1
   ```

4. **Get Party Info**:
   ```
   /party-info party-id:1
   ```

5. **Leave a Party**:
   ```
   /party-leave party-id:1
   ```

## How It Works

### Party Creation
- Users create parties with a name, scheduled time, description, and max member limit
- The creator is automatically added as the first member
- A notification is scheduled for 1 hour before the party starts

### Joining & Leaving
- Users can join parties using the party ID
- The system checks for party capacity and prevents duplicate joins
- Users can leave parties at any time

### Notifications
- A scheduler runs every minute checking for pending notifications
- When a notification time is reached, all party members are mentioned
- Notifications are sent to the configured notification channel

### Database Structure
- **parties**: Stores party details (name, time, creator, etc.)
- **party_members**: Tracks who joined which party
- **notifications**: Manages scheduled notification times

## Development

### Adding New Commands

1. Create a new file in `src/commands/` (e.g., `mycommand.js`)
2. Follow this structure:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My command description'),
    
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

3. Run `npm run deploy-commands` to register the new command

### Adding New Events

1. Create a new file in `src/events/` (e.g., `myevent.js`)
2. Follow this structure:

```javascript
const { Events } = require('discord.js');

module.exports = {
  name: Events.EventName,
  once: false, // or true for one-time events
  execute(...args) {
    // Event handler logic
  },
};
```

## Troubleshooting

### Bot doesn't respond to commands
- Ensure slash commands are deployed: `npm run deploy-commands`
- Check bot has proper permissions in the server
- Verify the bot is online in your server

### Database connection fails
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure the database exists

### Notifications not sending
- Verify `NOTIFICATION_CHANNEL_ID` is correct in `.env`
- Check bot has permission to send messages in that channel
- Ensure the scheduler is running (check console logs)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.