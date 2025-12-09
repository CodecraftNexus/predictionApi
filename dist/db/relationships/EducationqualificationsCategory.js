"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEducationqualificationsCategoryRelationship = initEducationqualificationsCategoryRelationship;
function initEducationqualificationsCategoryRelationship(models) {
    const { EducationqualificationsCatagory, EducationqualificationsItem } = models;
    if (!EducationqualificationsCatagory || !EducationqualificationsItem)
        return;
    EducationqualificationsCatagory.hasMany(EducationqualificationsItem, {
        sourceKey: "id",
        foreignKey: "EducationqualificationsCategoryId",
        as: "EducationqualificationsItems",
    });
}
