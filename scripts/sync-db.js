/*
const Model = require("./models/model"); 
*/
const WelcomeSettings = require("../models/welcomeSettings");

// Use alter to add to existing data
// Use force to wipe everything
/*
Model.sync({ alter: true });
*/
WelcomeSettings.sync({ alter: true });