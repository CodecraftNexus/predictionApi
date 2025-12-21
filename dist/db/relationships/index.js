"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRelationship = initRelationship;
const User_1 = require("./User");
const BirthLocation_1 = require("./BirthLocation");
const Gender_1 = require("./Gender");
const PredictionPlanet_1 = require("./PredictionPlanet");
const JobsItem_1 = require("./JobsItem");
const JobCategory_1 = require("./JobCategory");
const EducationqualificationsItem_1 = require("./EducationqualificationsItem");
const EducationqualificationsCategory_1 = require("./EducationqualificationsCategory");
const Admin_1 = require("./Admin");
const SubscriptionPackage_1 = require("./SubscriptionPackage");
const UserSubscription_1 = require("./UserSubscription");
const Payment_1 = require("./Payment");
const PredictionItem_1 = require("./PredictionItem");
const Predictioncategory_1 = require("./Predictioncategory");
const Feedback_1 = require("./Feedback");
function initRelationship(models) {
    (0, BirthLocation_1.initBirthLocationRelationship)(models);
    (0, Gender_1.initGenderRelationship)(models),
        (0, User_1.initUserRelationship)(models);
    (0, PredictionPlanet_1.initPredictionPlanetRelationship)(models);
    (0, JobsItem_1.initJobsItemRelationship)(models);
    (0, JobCategory_1.initJobCategoryRelationship)(models);
    (0, EducationqualificationsItem_1.initEducationqualificationsItemRelationship)(models);
    (0, EducationqualificationsCategory_1.initEducationqualificationsCategoryRelationship)(models);
    (0, Admin_1.initAdminRelationship)(models);
    (0, SubscriptionPackage_1.initSubscriptionPackageRelationship)(models);
    (0, UserSubscription_1.initUserSubscriptionRelationship)(models);
    (0, Payment_1.initPaymentRelationship)(models);
    (0, PredictionItem_1.initPredictionItemRelationship)(models);
    (0, Predictioncategory_1.initPredictioncategoryRelationship)(models);
    (0, Feedback_1.initFeedbackRelationships)(models);
}
