"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserRelationship = initUserRelationship;
function initUserRelationship(models) {
    const { User, RefreshToken, OAuthAccount, PalentHouse, DashaBalance, AntharDasha, Predictions, Educationqualifications, Jobs, EducationqualificationsItem, JobsItem, ProfileImage, Navamsaka, AstrologicalDetails, UserFeedback } = models;
    if (!User)
        return;
    if (OAuthAccount) {
        OAuthAccount.belongsTo(User, { foreignKey: "userId" });
        User.hasMany(OAuthAccount, { foreignKey: "userId" });
    }
    if (RefreshToken) {
        User.hasMany(RefreshToken, { foreignKey: "userId" });
    }
    if (PalentHouse) {
        User.hasMany(PalentHouse, { foreignKey: "userId" });
    }
    if (DashaBalance) {
        User.hasMany(DashaBalance, { foreignKey: "userId" });
    }
    if (AntharDasha) {
        User.hasMany(AntharDasha, { foreignKey: "userId" });
    }
    if (Predictions) {
        User.hasMany(Predictions, { foreignKey: "userId" });
    }
    if (Educationqualifications) {
        User.hasMany(Educationqualifications, {
            foreignKey: "userId",
            as: "userEducationQualifications"
        });
    }
    if (Jobs) {
        User.hasMany(Jobs, {
            foreignKey: "userId",
            as: "userJobs"
        });
    }
    if (EducationqualificationsItem && Educationqualifications) {
        User.belongsToMany(EducationqualificationsItem, {
            through: Educationqualifications,
            foreignKey: "userId",
            otherKey: "EducationqualificationsItemId",
            as: "educationItems"
        });
    }
    if (JobsItem && Jobs) {
        User.belongsToMany(JobsItem, {
            through: Jobs,
            foreignKey: "userId",
            otherKey: "JobItemId",
            as: "jobItems"
        });
    }
    if (ProfileImage) {
        User.hasMany(ProfileImage, { foreignKey: "userId" });
    }
    if (Navamsaka) {
        User.hasMany(Navamsaka, { foreignKey: "userId" });
    }
    if (AstrologicalDetails) {
        User.hasMany(AstrologicalDetails, { foreignKey: "userId" });
    }
    if (UserFeedback) {
        User.hasMany(UserFeedback, { foreignKey: "userId" });
    }
}
