const { logger } = require("../utils/roc-logger");
const config = require("../utils/config");
const { Events, ActivityType } = require("discord.js");

// Status change function
let listIndex = 0;
function updateBotStatus(client) {
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

module.exports = {
    name: Events.ClientReady,
    // once: true,
    execute(client) {
        updateBotStatus(client); // Call this function when the bot is ready.

        // Set up an interval to change the status.
        setInterval(updateBotStatus, 5000, client);
    },
};
