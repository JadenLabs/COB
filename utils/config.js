const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("config.yaml", "utf8"));

module.exports = config;
