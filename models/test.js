const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Test = sequelize.define("link", {
    value: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
});

module.exports = Test;
