"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initJobsItemRelationship = initJobsItemRelationship;
function initJobsItemRelationship(models) {
    const { Jobs, JobsItem, User, JobsCategory } = models;
    if (!JobsItem)
        return;
    if (Jobs) {
        JobsItem.hasMany(Jobs, {
            foreignKey: "JobItemId",
            as: "jobAssignments"
        });
    }
    if (JobsCategory) {
        JobsItem.belongsTo(JobsCategory, {
            foreignKey: "JobCategoryId",
            as: "category"
        });
    }
    if (User && Jobs) {
        JobsItem.belongsToMany(User, {
            through: Jobs,
            foreignKey: "JobItemId",
            otherKey: "userId",
            as: "users"
        });
    }
}
