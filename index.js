// Files
const fs = require("node:fs");
const path = require("node:path");
// Config
const config = require("./utils/config");
const { token } = require("./token.json");
// Discord
const {
    Client,
    Events,
    Collection,
    ActivityType,
    GatewayIntentBits,
} = require("discord.js");
// Other packages
const { logger } = require("./utils/roc-logger");
const colors = require("colors");
const os = require("os");
const { performance } = require("perf_hooks");

// Perf
const startTime = performance.now();
const startUsage = process.cpuUsage();

// Create a new client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
});

// Exports
module.exports = { client, startUsage, startTime };

// Command Collection
client.commands = new Collection();

// Load Commands
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            logger(
                "Bot",
                "C-Loader",
                "Warn",
                `The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

// Load and handle events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(token);
