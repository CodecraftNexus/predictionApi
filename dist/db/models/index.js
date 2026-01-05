"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRefreshToken = exports.AdminOAuthAccount = exports.Admin = exports.Payment = exports.UserSubscription = exports.SubscriptionPackage = exports.DeceasedFamilyMember = exports.UserFeedbackQuestion = exports.UserFeedbackAnswer = exports.AstrologicalDetails = exports.planetLocatinsPredictins = exports.PredictionFeedback = exports.PredictionTranslation = exports.PredictionPlanet = exports.LifeTimePredictions = exports.LifeTimePredictionCategory = exports.AntharDasha = exports.Mahadahsha = exports.Navanshaka = exports.PlanetHouse = exports.ApiKey = exports.OAuthAccount = exports.RefreshToken = exports.ProfileImage = exports.Jobs = exports.JobsItem = exports.JobsCategory = exports.EducationQualificationsItem = exports.EducationQualificationsCategory = exports.EducationQualifications = exports.Language = exports.Gender = exports.BirthLocation = exports.Users = void 0;
const PredictionTranslation_1 = require("./PredictionTranslation");
Object.defineProperty(exports, "PredictionTranslation", { enumerable: true, get: function () { return PredictionTranslation_1.PredictionTranslation; } });
const hooks_1 = require("../hooks");
const relationships_1 = require("../relationships");
const Admin_1 = require("./Admin");
Object.defineProperty(exports, "Admin", { enumerable: true, get: function () { return Admin_1.Admin; } });
const AdminOAuthAccount_1 = require("./AdminOAuthAccount");
Object.defineProperty(exports, "AdminOAuthAccount", { enumerable: true, get: function () { return AdminOAuthAccount_1.AdminOAuthAccount; } });
const AdminRefreshToken_1 = require("./AdminRefreshToken");
Object.defineProperty(exports, "AdminRefreshToken", { enumerable: true, get: function () { return AdminRefreshToken_1.AdminRefreshToken; } });
const AntharDasha_1 = require("./AntharDasha");
Object.defineProperty(exports, "AntharDasha", { enumerable: true, get: function () { return AntharDasha_1.AntharDasha; } });
const ApiKey_1 = require("./ApiKey");
Object.defineProperty(exports, "ApiKey", { enumerable: true, get: function () { return ApiKey_1.ApiKey; } });
const BirthLoacation_1 = require("./BirthLoacation");
Object.defineProperty(exports, "BirthLocation", { enumerable: true, get: function () { return BirthLoacation_1.BirthLocation; } });
const EducationQualifications_1 = require("./EducationQualifications");
Object.defineProperty(exports, "EducationQualifications", { enumerable: true, get: function () { return EducationQualifications_1.EducationQualifications; } });
const EducationQualificationsCategory_1 = require("./EducationQualificationsCategory");
Object.defineProperty(exports, "EducationQualificationsCategory", { enumerable: true, get: function () { return EducationQualificationsCategory_1.EducationQualificationsCategory; } });
const EducationQualificationsItem_1 = require("./EducationQualificationsItem");
Object.defineProperty(exports, "EducationQualificationsItem", { enumerable: true, get: function () { return EducationQualificationsItem_1.EducationQualificationsItem; } });
const Gender_1 = require("./Gender");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return Gender_1.Gender; } });
const JobCategory_1 = require("./JobCategory");
Object.defineProperty(exports, "JobsCategory", { enumerable: true, get: function () { return JobCategory_1.JobsCategory; } });
const Jobs_1 = require("./Jobs");
Object.defineProperty(exports, "Jobs", { enumerable: true, get: function () { return Jobs_1.Jobs; } });
const JobsItem_1 = require("./JobsItem");
Object.defineProperty(exports, "JobsItem", { enumerable: true, get: function () { return JobsItem_1.JobsItem; } });
const Language_1 = require("./Language");
Object.defineProperty(exports, "Language", { enumerable: true, get: function () { return Language_1.Language; } });
const LifeTimePredictionCategory_1 = require("./LifeTimePredictionCategory");
Object.defineProperty(exports, "LifeTimePredictionCategory", { enumerable: true, get: function () { return LifeTimePredictionCategory_1.LifeTimePredictionCategory; } });
const LifeTimePredictions_1 = require("./LifeTimePredictions");
Object.defineProperty(exports, "LifeTimePredictions", { enumerable: true, get: function () { return LifeTimePredictions_1.LifeTimePredictions; } });
const Mahadahsha_1 = require("./Mahadahsha");
Object.defineProperty(exports, "Mahadahsha", { enumerable: true, get: function () { return Mahadahsha_1.Mahadahsha; } });
const Navanshaka_1 = require("./Navanshaka");
Object.defineProperty(exports, "Navanshaka", { enumerable: true, get: function () { return Navanshaka_1.Navanshaka; } });
const OAuthAccount_1 = require("./OAuthAccount");
Object.defineProperty(exports, "OAuthAccount", { enumerable: true, get: function () { return OAuthAccount_1.OAuthAccount; } });
const PlanetHouse_1 = require("./PlanetHouse");
Object.defineProperty(exports, "PlanetHouse", { enumerable: true, get: function () { return PlanetHouse_1.PlanetHouse; } });
const PredictionPlanet_1 = require("./PredictionPlanet");
Object.defineProperty(exports, "PredictionPlanet", { enumerable: true, get: function () { return PredictionPlanet_1.PredictionPlanet; } });
const ProfileImage_1 = require("./ProfileImage");
Object.defineProperty(exports, "ProfileImage", { enumerable: true, get: function () { return ProfileImage_1.ProfileImage; } });
const RefreshToken_1 = require("./RefreshToken");
Object.defineProperty(exports, "RefreshToken", { enumerable: true, get: function () { return RefreshToken_1.RefreshToken; } });
const Users_1 = require("./Users");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return Users_1.Users; } });
const PredictionFeedback_1 = require("./PredictionFeedback");
Object.defineProperty(exports, "PredictionFeedback", { enumerable: true, get: function () { return PredictionFeedback_1.PredictionFeedback; } });
const planetLocatinsPredictins_1 = require("./planetLocatinsPredictins");
Object.defineProperty(exports, "planetLocatinsPredictins", { enumerable: true, get: function () { return planetLocatinsPredictins_1.planetLocatinsPredictins; } });
const UserFeedbackAnswer_1 = require("./UserFeedbackAnswer");
Object.defineProperty(exports, "UserFeedbackAnswer", { enumerable: true, get: function () { return UserFeedbackAnswer_1.UserFeedbackAnswer; } });
const UserFeedbackQuestion_1 = require("./UserFeedbackQuestion");
Object.defineProperty(exports, "UserFeedbackQuestion", { enumerable: true, get: function () { return UserFeedbackQuestion_1.UserFeedbackQuestion; } });
const DeceasedFamilyMember_1 = require("./DeceasedFamilyMember");
Object.defineProperty(exports, "DeceasedFamilyMember", { enumerable: true, get: function () { return DeceasedFamilyMember_1.DeceasedFamilyMember; } });
const SubscriptionPackage_1 = require("./SubscriptionPackage");
Object.defineProperty(exports, "SubscriptionPackage", { enumerable: true, get: function () { return SubscriptionPackage_1.SubscriptionPackage; } });
const UserSubscription_1 = require("./UserSubscription");
Object.defineProperty(exports, "UserSubscription", { enumerable: true, get: function () { return UserSubscription_1.UserSubscription; } });
const AstrologicalDetails_1 = require("./AstrologicalDetails");
Object.defineProperty(exports, "AstrologicalDetails", { enumerable: true, get: function () { return AstrologicalDetails_1.AstrologicalDetails; } });
const Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
const models = {
    Users: Users_1.Users,
    BirthLocation: BirthLoacation_1.BirthLocation,
    Gender: Gender_1.Gender,
    Language: Language_1.Language,
    EducationQualifications: EducationQualifications_1.EducationQualifications,
    EducationQualificationsCategory: EducationQualificationsCategory_1.EducationQualificationsCategory,
    EducationQualificationsItem: EducationQualificationsItem_1.EducationQualificationsItem,
    JobsCategory: JobCategory_1.JobsCategory,
    JobsItem: JobsItem_1.JobsItem,
    Jobs: Jobs_1.Jobs,
    ProfileImage: ProfileImage_1.ProfileImage,
    RefreshToken: RefreshToken_1.RefreshToken,
    OAuthAccount: OAuthAccount_1.OAuthAccount,
    ApiKey: ApiKey_1.ApiKey,
    PlanetHouse: PlanetHouse_1.PlanetHouse,
    Navanshaka: Navanshaka_1.Navanshaka,
    Mahadahsha: Mahadahsha_1.Mahadahsha,
    AntharDasha: AntharDasha_1.AntharDasha,
    LifeTimePredictionCategory: LifeTimePredictionCategory_1.LifeTimePredictionCategory,
    LifeTimePredictions: LifeTimePredictions_1.LifeTimePredictions,
    PredictionPlanet: PredictionPlanet_1.PredictionPlanet,
    PredictionFeedback: PredictionFeedback_1.PredictionFeedback,
    planetLocatinsPredictins: planetLocatinsPredictins_1.planetLocatinsPredictins,
    AstrologicalDetails: AstrologicalDetails_1.AstrologicalDetails,
    UserFeedbackAnswer: UserFeedbackAnswer_1.UserFeedbackAnswer,
    UserFeedbackQuestion: UserFeedbackQuestion_1.UserFeedbackQuestion,
    DeceasedFamilyMember: DeceasedFamilyMember_1.DeceasedFamilyMember,
    SubscriptionPackage: SubscriptionPackage_1.SubscriptionPackage,
    UserSubscription: UserSubscription_1.UserSubscription,
    Payment: Payment_1.Payment,
    Admin: Admin_1.Admin,
    AdminOAuthAccount: AdminOAuthAccount_1.AdminOAuthAccount,
    AdminRefreshToken: AdminRefreshToken_1.AdminRefreshToken
};
(0, hooks_1.initHooks)(models);
(0, relationships_1.initRelationship)(models);
