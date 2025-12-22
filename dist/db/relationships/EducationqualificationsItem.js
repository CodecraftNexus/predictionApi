"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEducationqualificationsItemRelationship = initEducationqualificationsItemRelationship;
function initEducationqualificationsItemRelationship(models) {
    const { Educationqualifications, EducationqualificationsItem, EducationqualificationsCategory, User } = models;
    if (!EducationqualificationsItem)
        return;
    if (Educationqualifications) {
        EducationqualificationsItem.hasMany(Educationqualifications, {
            foreignKey: "EducationqualificationsItemId",
            as: "educationAssignments"
        });
    }
    if (EducationqualificationsCategory) {
        EducationqualificationsItem.belongsTo(EducationqualificationsCategory, {
            foreignKey: "EducationqualificationsCategoryId",
            as: "category"
        });
    }
    if (User && Educationqualifications) {
        EducationqualificationsItem.belongsToMany(User, {
            through: Educationqualifications,
            foreignKey: "EducationqualificationsItemId",
            otherKey: "userId",
            as: "users"
        });
    }
}
