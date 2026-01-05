"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRelationship = initRelationship;
const Admin_1 = require("./Admin");
const Feedback_1 = require("./Feedback");
const Prediction_1 = require("./Prediction");
const User_1 = require("./User");
const UserSubscription_1 = require("./UserSubscription");
function initRelationship(models) {
    (0, User_1.initUserRelationship)(models);
    (0, Admin_1.initAdminRelationship)(models);
    (0, Prediction_1.initPredictionRelationship)(models);
    (0, Feedback_1.initFeedbackRelationships)(models);
    (0, UserSubscription_1.initUserSubscriptionRelationship)(models);
}
