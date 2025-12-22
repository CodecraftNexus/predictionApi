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
exports.initPaymentRelationship = initPaymentRelationship;
function initPaymentRelationship(models) {
    const { Payment, User } = models;
    if (Payment && User) {
        User.hasMany(Payment, { foreignKey: "userId" });
        Payment.belongsTo(User, { foreignKey: "userId" });
    }
}
const models_1 = require("../models");
if (models_1.User) {
    models_1.User.afterCreate((user, options) => __awaiter(void 0, void 0, void 0, function* () {
        const defaultPackage = yield models_1.SubscriptionPackage.findOne({ where: { name: 'Silver' } });
        if (defaultPackage) {
            yield models_1.UserSubscription.create({
                userId: parseInt(user.id),
                packageId: defaultPackage.id,
                duration: null,
                startDate: new Date(),
                endDate: null,
                status: 'active',
            }, { transaction: options.transaction });
        }
    }));
}
