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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionPackages = getSubscriptionPackages;
exports.getCurrentSubscription = getCurrentSubscription;
exports.initiateSubscriptionPayment = initiateSubscriptionPayment;
exports.payhereNotify = payhereNotify;
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../db");
const env_1 = require("../config/env");
const payhereUrl = env_1.env.PAYHERE_SANDBOX === 'true' ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout';
function getSubscriptionPackages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const packages = yield db_1.db.SubscriptionPackage.findAll();
            return res.status(200).json({ success: true, packages });
        }
        catch (error) {
            console.error("getSubscriptionPackages error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function getCurrentSubscription(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const currentSub = yield db_1.db.UserSubscription.findOne({
                where: { userId, status: 'active' },
                order: [['startDate', 'DESC']],
                include: [db_1.db.SubscriptionPackage],
            });
            if (!currentSub) {
                return res.status(200).json({
                    success: true, subscription: {
                        id: "1"
                    }
                });
            }
            return res.json({ success: true, subscription: currentSub });
        }
        catch (error) {
            console.error("getCurrentSubscription error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function initiateSubscriptionPayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const { packageId, duration } = req.body;
            if (!packageId || !duration || !['monthly', 'yearly'].includes(duration)) {
                return res.status(400).json({ success: false, message: "Invalid package or duration" });
            }
            const pkg = yield db_1.db.SubscriptionPackage.findByPk(packageId);
            if (!pkg) {
                return res.status(404).json({ success: false, message: "Package not found" });
            }
            if (pkg.name === 'Silver') {
                return res.status(400).json({ success: false, message: "Silver is free, no payment needed" });
            }
            const amount = duration === 'monthly' ? pkg.monthly_price : pkg.yearly_price;
            if (amount <= 0 || isNaN(amount)) {
                return res.status(400).json({ success: false, message: "Invalid amount" });
            }
            const orderId = `sub-${(0, uuid_1.v4)().slice(0, 8)}`;
            const payment = yield db_1.db.Payment.create({
                userId: Number(userId),
                amount,
                gateway: 'payhere',
                orderId,
                status: 'pending',
            });
            const user = yield db_1.db.User.findByPk(userId);
            const merchant_id = env_1.env.PAYHERE_MERCHANT_ID;
            const merchant_secret = env_1.env.PAYHERE_MERCHANT_SECRET;
            const payhereUrl = "https://sandbox.payhere.lk/pay/checkout";
            const formattedAmount = Number(amount).toFixed(2);
            const secretHash = crypto_1.default
                .createHash("md5")
                .update(merchant_secret)
                .digest("hex")
                .toUpperCase();
            const hash = crypto_1.default
                .createHash("md5")
                .update(merchant_id +
                orderId +
                formattedAmount +
                "LKR" +
                secretHash)
                .digest("hex")
                .toUpperCase();
            const payData = {
                merchant_id,
                order_id: orderId,
                items: `${pkg.name} ${duration} Subscription`,
                amount: formattedAmount,
                currency: "LKR",
                first_name: ((_b = user === null || user === void 0 ? void 0 : user.name) === null || _b === void 0 ? void 0 : _b.split(" ")[0]) || "",
                last_name: ((_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.split(" ").slice(1).join(" ")) || "",
                email: (user === null || user === void 0 ? void 0 : user.email) || "",
                phone: (user === null || user === void 0 ? void 0 : user.WhatsappNumber) || "",
                country: "Sri Lanka",
                custom_1: `${packageId}|${duration}`,
                hash,
                notify_url: `${env_1.env.base_Url}/api/subscription/payhere-notify`,
                return_url: `${env_1.env.CORS_ORIGINS}/payment-success`,
                cancel_url: `${env_1.env.CORS_ORIGINS}/payment-cancel`,
            };
            return res.json({
                success: true,
                payData,
                payUrl: payhereUrl
            });
        }
        catch (error) {
            console.error("initiateSubscriptionPayment error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function payhereNotify(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig, } = req.body;
            const merchantSecret = env_1.env.PAYHERE_MERCHANT_SECRET;
            const localHashStr = merchant_id + order_id + payhere_amount + payhere_currency + status_code + crypto_1.default.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
            const localHash = crypto_1.default.createHash('md5').update(localHashStr).digest('hex').toUpperCase();
            if (localHash !== md5sig) {
                return res.status(400).send("Invalid signature");
            }
            const payment = yield db_1.db.Payment.findOne({ where: { orderId: order_id } });
            if (!payment) {
                return res.status(404).send("Payment not found");
            }
            payment.transactionId = req.body.payment_id;
            payment.responseData = req.body;
            payment.status = parseInt(status_code) === 2 ? 'success' : 'failed';
            yield payment.save();
            if (payment.status === 'success') {
                const [packageId, duration] = req.body.custom_1.split('|');
                const endDate = new Date();
                if (duration === 'monthly') {
                    endDate.setMonth(endDate.getMonth() + 1);
                }
                else if (duration === 'yearly') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }
                yield db_1.db.UserSubscription.update({ status: 'expired' }, { where: { userId: payment.userId, status: 'active' } });
                yield db_1.db.UserSubscription.create({
                    userId: payment.userId,
                    packageId: parseInt(packageId),
                    duration,
                    startDate: new Date(),
                    endDate,
                    status: 'active',
                    paymentId: payment.id,
                });
            }
            return res.status(200).send("OK");
        }
        catch (error) {
            console.error("payhereNotify error:", error);
            return res.status(500).send("Server error");
        }
    });
}
