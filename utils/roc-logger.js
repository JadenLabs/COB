// Libraries
const colors = require("colors");

// Exports
module.exports = {
    async logger(app, subprocess, severity, method, message) {
        // Severity
        let severityMessage = "";
        switch (severity) {
            case "Info":
                severityMessage = colors.gray(severity);
                break;
            case "Warn":
                severityMessage = colors.yellow(severity);
                break;
            case "Error":
                severityMessage = colors.red(severity);
                break;
            case "Fatal":
                severityMessage = colors.bgRed(severity);
                break;
            default:
                severityMessage = colors.gray(severity);
                break;
        }

        // Date
        const now = new Date();
        const date = now.toISOString();

        // Subprocess default
        const subprocessMessage =
            subprocess !== false ? `[${colors.cyan(subprocess)}]` : "";

        // Method default
        let methodMessage = "";
        switch (method) {
            case "GET":
                methodMessage = ` [${colors.green(method)}]`;
                break;
            case "POST":
                methodMessage = ` [${colors.magenta(method)}]`;
                break;
            case "PUT":
                methodMessage = ` [${colors.yellow(method)}]`;
                break;
            case "DELETE":
                methodMessage = ` [${colors.red(method)}]`;
                break;
            default:
                methodMessage = "";
                break;
        }

        // Message default
        const messageMessage = message ? `: ${message}` : "";

        // Return
        return console.log(
            `[${colors.blue(app)}] ${subprocessMessage} [${colors.grey(
                date
            )}] [${severityMessage}]${methodMessage}${messageMessage}`
        );
    },
};
