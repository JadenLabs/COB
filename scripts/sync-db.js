/*
const Model = require("./models/model"); 
*/
const InterviewSettings = require("../models/interviewSettings");
const OutgoingRequests = require("../models/outgoingRequests");
const WelcomeSettings = require("../models/welcomeSettings");
const NetworkSettings = require("../models/networkSettings");
const ReplyListener = require("../models/replyListener");
const Partnerships = require("../models/partnerships");
const Interviews = require("../models/interviews");
const Admins = require("../models/admins");
const Bans = require("../models/bans");

// Use alter to add to existing data
// Use force to wipe everything
/*
Model.sync({ alter: true });
*/
InterviewSettings.sync({ alter: true });
OutgoingRequests.sync({ alter: true });
WelcomeSettings.sync({ alter: true });
NetworkSettings.sync({ alter: true });
ReplyListener.sync({ alter: true });
Partnerships.sync({ alter: true });
Interviews.sync({ alter: true });
Admins.sync({ alter: true });
Bans.sync({ alter: true });
