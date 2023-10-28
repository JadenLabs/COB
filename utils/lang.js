const fs = require("fs");
const yaml = require("js-yaml");
const lang = yaml.load(fs.readFileSync("lang.yaml", "utf8"));

module.exports = lang;
