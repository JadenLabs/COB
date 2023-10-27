// Config
const config = require("./utils/config");
const { token } = require("./token.json");
// Discord
const {
    Client,
    Events,
    GatewayIntentBits,
    ActivityType,
} = require("discord.js");
// Other packages
const { logger } = require("./utils/roc-logger");

// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
    logger(
        "Bot",
        "Login",
        "Info",
        null,
        `Logged in as ${c.user.tag.magenta}`
    )
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

    // Set up an interval to ping the API every 15 seconds (15,000 milliseconds).
    setInterval(updateBotStatus, 15000);
});

// Log in to Discord with your client's token
client.login(token);
