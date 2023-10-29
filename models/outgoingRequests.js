const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const OutgoingRequests = sequelize.define("outgoingRequest", {
    requestID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    guild1: {
        type: Sequelize.STRING,
        required: true,
    },
    guild2: {
        type: Sequelize.STRING,
        required: true,
    }
});

module.exports = OutgoingRequests;
