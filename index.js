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

// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
    logger("Bot", "Login", "Info", `Logged in as ${c.user.tag.magenta}`);
});

// Status change function
let listIndex = 0;
function updateBotStatus() {
    const statusList = config.statusMessages;
    const name = statusList[listIndex];
    const length = statusList.length;

    client.user.setPresence({
        activities: [
            {
                name: name,
                type: ActivityType.Watching,
            },
        ],
        status: config.statusType,
    });

    listIndex += 1;
    if (listIndex === length) {
        listIndex = 0;
    }
}

// On ready
client.on("ready", () => {
    updateBotStatus(); // Call this function when the bot is ready.

    // Set up an interval to change the status.
    setInterval(updateBotStatus, 5000);
});

// Log in to Discord with your client's token
client.login(token);
