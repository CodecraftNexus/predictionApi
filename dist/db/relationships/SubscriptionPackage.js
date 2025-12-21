"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSubscriptionPackageRelationship = initSubscriptionPackageRelationship;
function initSubscriptionPackageRelationship(models) {
    const { SubscriptionPackage, UserSubscription } = models;
    if (SubscriptionPackage && UserSubscription) {
        SubscriptionPackage.hasMany(UserSubscription, { foreignKey: "packageId" });
        UserSubscription.belongsTo(SubscriptionPackage, { foreignKey: "packageId" });
    }
}
