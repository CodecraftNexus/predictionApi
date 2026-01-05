"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserRelationship = initUserRelationship;
function initUserRelationship(models) {
    const { Users, BirthLocation, Gender, Language, EducationQualificationsItem, EducationQualifications, EducationQualificationsCategory, Jobs, JobsItem, JobsCategory, ProfileImage, RefreshToken, OAuthAccount } = models;
    if (!Users)
        return;
    if (BirthLocation) {
        BirthLocation.hasMany(Users, { foreignKey: "birth_location_id" });
        Users.belongsTo(BirthLocation, { foreignKey: "birth_location_id" });
    }
    if (Gender) {
        Gender.hasMany(Users, { foreignKey: "gender_id" });
        Users.belongsTo(Gender, { foreignKey: "gender_id" });
    }
    if (Language) {
        Language.hasMany(Users, { foreignKey: "language_id" });
        Users.belongsTo(Language, { foreignKey: "language_id" });
    }
    if (EducationQualifications && EducationQualificationsItem) {
        Users.belongsToMany(EducationQualificationsItem, {
            through: EducationQualifications,
            foreignKey: 'user_id',
            otherKey: 'education_qualifications_item_id',
            as: 'qualifications'
        });
        EducationQualificationsItem.belongsToMany(Users, {
            through: EducationQualifications,
            foreignKey: 'education_qualifications_item_id',
            otherKey: 'user_id',
            as: 'users'
        });
    }
    if (EducationQualificationsCategory) {
        EducationQualificationsCategory.hasMany(EducationQualificationsItem, { foreignKey: "education_qualifications_category_id", as: "EducationqualificationsItems" });
        EducationQualificationsItem.belongsTo(EducationQualificationsCategory, { foreignKey: "education_qualifications_category_id", as: "EducationQualificationsCategory" });
    }
    if (Jobs && JobsItem) {
        Users.belongsToMany(JobsItem, {
            through: Jobs,
            foreignKey: 'user_id',
            otherKey: 'job_item_id',
            as: 'jobs'
        });
        JobsItem.belongsToMany(Users, {
            through: Jobs,
            foreignKey: 'job_item_id',
            otherKey: 'user_id',
            as: 'users'
        });
    }
    if (JobsCategory) {
        JobsCategory.hasMany(JobsItem, { foreignKey: "job_category_id", as: "JobsItem" });
        JobsItem.belongsTo(JobsCategory, { foreignKey: "job_category_id", as: "JobsCategory" });
    }
    if (ProfileImage) {
        Users.hasOne(ProfileImage, {
            foreignKey: "user_id",
            as: "profileImage",
        });
        ProfileImage.belongsTo(Users, {
            foreignKey: "user_id",
            as: "user",
        });
    }
    if (RefreshToken) {
        Users.hasMany(RefreshToken, { foreignKey: "user_id" });
        RefreshToken.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (OAuthAccount) {
        Users.hasMany(OAuthAccount, { foreignKey: "user_id" });
        OAuthAccount.belongsTo(Users, { foreignKey: "user_id" });
    }
}
