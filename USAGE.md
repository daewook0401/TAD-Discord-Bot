# Usage Examples

This document provides examples of how to use the TAD Discord Bot.

## Setup Example

After following the installation instructions in README.md, your bot should be running. You'll see output like:

```
[INFO] Loaded command: party-create
[INFO] Loaded command: party-join
[INFO] Loaded command: party-leave
[INFO] Loaded command: party-list
[INFO] Loaded command: party-info
[INFO] Loaded command: help
[INFO] Loaded command: ping
[INFO] Loaded event: ready
[INFO] Loaded event: interactionCreate
[INFO] Connected to MySQL database
[INFO] Database tables initialized
[INFO] Starting notification scheduler...
[INFO] Notification scheduler started (runs every minute)
[INFO] Bot is ready! Logged in as TAD-Bot#1234
[INFO] Serving 1 guild(s)
```

## Command Examples

### 1. Create a Party

Create a party for a gaming session:

```
/party-create name:"Friday Game Night" time:"2024-12-29 20:00" description:"Let's play some games together!" max-members:8
```

Response will include:
- Party ID (e.g., 1)
- Scheduled time
- Current member count (1 - the creator)
- Instructions on how to join

### 2. List Active Parties

See all upcoming parties:

```
/party-list
```

This will show:
- All active parties in the server
- Party names and IDs
- Scheduled times
- Current member counts
- Party descriptions

### 3. Join a Party

Join an existing party using its ID:

```
/party-join party-id:1
```

The bot will:
- Check if the party exists
- Verify it's not full
- Confirm you're not already a member
- Add you to the party
- Show you party details

### 4. Get Party Information

Get detailed information about a specific party:

```
/party-info party-id:1
```

This displays:
- Party name and description
- Scheduled time
- Member count and limit
- Full list of members
- Party creator
- Current status

### 5. Leave a Party

Leave a party you joined:

```
/party-leave party-id:1
```

The bot will:
- Remove you from the party
- Confirm the action
- Show remaining member count

### 6. Get Help

See all available commands:

```
/help
```

### 7. Check Bot Status

Check if the bot is responsive:

```
/ping
```

Response includes:
- Bot latency
- API latency

## Notification Example

When a party is scheduled to start in 1 hour, all members receive a notification:

```
🔔 Party Reminder: Friday Game Night

Your party is starting in 1 hour!

Scheduled Time: 12/29/2024, 8:00:00 PM
Party ID: 1
Members: 5

Get ready to party!
```

All party members are mentioned in the notification.

## Time Format

When creating parties, use the format: `YYYY-MM-DD HH:MM`

Examples:
- `2024-12-31 20:00` - December 31, 2024 at 8:00 PM
- `2024-01-15 14:30` - January 15, 2024 at 2:30 PM
- `2024-06-01 09:00` - June 1, 2024 at 9:00 AM

## Common Scenarios

### Scenario 1: Weekend Party

1. User creates a party for Saturday
2. Shares the Party ID in the server
3. Friends join throughout the week
4. On Saturday, 1 hour before the party, everyone gets notified
5. Party members gather and start playing

### Scenario 2: Last-Minute Plans

1. User creates a party for later today
2. Only friends who are available join
3. If plans change, members can leave
4. Notification reminds everyone when it's time

### Scenario 3: Regular Events

1. Create a weekly party (e.g., every Friday)
2. Regular players know to check `/party-list`
3. Everyone joins the upcoming party
4. System sends automatic reminders

## Best Practices

1. **Create parties in advance** - Give people time to see and join
2. **Use descriptive names** - Help people know what the party is about
3. **Set reasonable max-members** - Don't make it too large or too small
4. **Check party info** - Use `/party-info` to see who's joining
5. **Leave early if plans change** - Help the host know who's coming

## Troubleshooting

### Party ID not found
Make sure you're using the correct Party ID. Use `/party-list` to see all available parties.

### Can't join - Party full
The party has reached its maximum member limit. Try creating a new party or wait for someone to leave.

### Already a member
You've already joined this party. Use `/party-info` to view details or `/party-leave` to leave.

### Time in the past
Parties must be scheduled for a future time. Check your time format and ensure the date is in the future.
