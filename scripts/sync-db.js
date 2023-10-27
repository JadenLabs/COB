/*
const Model = require("./models/model"); 
*/
const Test = require("../models/test");

// Use alter to add to existing data
// Use force to wipe everything
/*
Model.sync({ alter: true });
*/
Test.sync({ alter: true });