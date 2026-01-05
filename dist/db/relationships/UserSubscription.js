"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserSubscriptionRelationship = initUserSubscriptionRelationship;
function initUserSubscriptionRelationship(models) {
    const { UserSubscription, Users, Payment } = models;
    if (UserSubscription && Users) {
        Users.hasMany(UserSubscription, { foreignKey: "user_id" });
        UserSubscription.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (UserSubscription && Payment) {
        Payment.hasOne(UserSubscription, { foreignKey: "payment_id" });
        UserSubscription.belongsTo(Payment, { foreignKey: "payment_id" });
    }
    if (Payment && Users) {
        Users.hasMany(Payment, { foreignKey: "userId" });
        Payment.belongsTo(Users, { foreignKey: "userId" });
    }
}
const models_1 = require("../models");
if (models_1.Users) {
    models_1.Users.afterCreate((user, options) => __awaiter(void 0, void 0, void 0, function* () {
        const defaultPackage = yield models_1.SubscriptionPackage.findOne({ where: { name: 'Silver' } });
        if (defaultPackage) {
            yield models_1.UserSubscription.create({
                user_id: user.id,
                package_id: String(defaultPackage.id),
                duration: null,
                start_date: new Date(),
                end_date: null,
                status: 'active',
            }, { transaction: options.transaction });
        }
    }));
}
