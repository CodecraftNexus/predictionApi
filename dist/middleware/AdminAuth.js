"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = requireAdminAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const isDev = env_1.env.NODE_ENV !== "production";
function requireAdminAuth(req, res, next) {
    var _a;
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
        if (!payload.adminId || !payload.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        req.admin = { adminId: payload.adminId };
        return next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}
