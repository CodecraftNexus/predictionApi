"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserSubscriptionRelationship = initUserSubscriptionRelationship;
function initUserSubscriptionRelationship(models) {
    const { UserSubscription, User, Payment } = models;
    if (UserSubscription && User) {
        User.hasMany(UserSubscription, { foreignKey: "userId" });
        UserSubscription.belongsTo(User, { foreignKey: "userId" });
    }
    if (UserSubscription && Payment) {
        Payment.hasOne(UserSubscription, { foreignKey: "paymentId" });
        UserSubscription.belongsTo(Payment, { foreignKey: "paymentId" });
    }
}
