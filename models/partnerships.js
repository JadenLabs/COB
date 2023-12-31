const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Partnerships = sequelize.define("partnership", {
    partnershipId: {
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
    },
});

module.exports = Partnerships;
