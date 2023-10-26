// Libraries
const colors = require("colors");

// Exports
module.exports = {
    async logger(app, subprocess, severity, method, message) {
        // Severity
        let severityMessage = "";
        switch (severity) {
            case "Info":
                severityMessage = severity.grey;
                break;
            case "Warn":
                severityMessage = severity.yellow;
                break;
            case "Error":
                severityMessage = severity.red;
                break;
            case "Fatal":
                severityMessage = severity.bgRed;
                break;
            default:
                severityMessage = severity.grey;
                break;
        }

        // Date
        const now = new Date();
        const date = now.toISOString();

        // Subprocess default
        const subprocessMessage = subprocess ? `[${subprocess.cyan}]` : "";

        // Method default
        let methodMessage = "";
        switch (method) {
            case "GET":
                methodMessage = ` [${method.green}]`;
                break;
            case "POST":
                methodMessage = ` [${method.magenta}]`;
                break;
            case "PUT":
                methodMessage = ` [${method.yellow}]`;
                break;
            case "DELETE":
                methodMessage = ` [${method.red}]`;
                break;
            default:
                methodMessage = "";
                break;
        }

        // Message default
        const messageMessage = message ? `: ${message}` : "";

        // Return
        return console.log(
            `[${app.blue}] ${subprocessMessage} [${date.grey}] [${severityMessage}]${methodMessage}${messageMessage}`
        );
    },
};
