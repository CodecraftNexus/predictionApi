"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initJobCategoryRelationship = initJobCategoryRelationship;
function initJobCategoryRelationship(models) {
    const { JobsCategory, JobsItem } = models;
    if (!JobsCategory || !JobsItem)
        return;
    JobsCategory.hasMany(JobsItem, {
        sourceKey: "id",
        foreignKey: "JobCategoryId",
        as: "JobsItem",
    });
}
