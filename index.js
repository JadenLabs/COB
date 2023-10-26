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

// Create a new client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Status change function
let listIndex = 0;
function updateBotStatus() {
    const name = config.status[listIndex];

    client.user.setPresence({
        activities: [
            {
                name: name,
                type: ActivityType.Watching,
            },
        ],
        status: "online",
    });

    listIndex += 1;
    if (listIndex === 4) {
        listIndex = 0;
    }
}

// On ready
client.on("ready", () => {
    updateBotStatus(); // Call this function when the bot is ready.

    // Set up an interval to ping the API every 15 seconds (15,000 milliseconds).
    setInterval(updateBotStatus, 5000);
});

// Log in to Discord with your client's token
client.login(token);
