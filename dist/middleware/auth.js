"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const isDev = env_1.env.NODE_ENV !== "production";
function requireAuth(req, res, next) {
    var _a, _b;
    const auth = isDev
        ? req.headers.authorization
        : ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.access_token) ? `Bearer ${req.cookies.access_token}` : undefined;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({
            success: false,
            message: "Missing or invalid Authorization header"
        });
    }
    const token = auth.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        const userId = (_b = payload.userId) !== null && _b !== void 0 ? _b : payload.sub;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }
        req.user = { userId };
        return next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}
