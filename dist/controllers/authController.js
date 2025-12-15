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
exports.Register = Register;
exports.Login = Login;
exports.refreshToken = refreshToken;
exports.googleLogin = googleLogin;
exports.logout = logout;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const env_1 = require("../config/env");
const parseDuratin_1 = __importDefault(require("../utils/parseDuratin"));
const cookie_helper_1 = require("../utils/cookie.helper");
const google_auth_library_1 = require("google-auth-library");
const isDev = env_1.env.NODE_ENV !== "production";
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fullName, email, password, username } = req.body;
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const normalizedUsername = username === null || username === void 0 ? void 0 : username.toLowerCase().trim();
            const existing = yield db_1.db.User.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        { email: normalizedEmail }, { username: normalizedUsername },
                    ],
                },
            });
            if (existing) {
                return res.status(409).json({ success: false, message: "User already exists with this email or username" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, env_1.env.BCRYPT_ROUNDS);
            const newUser = yield db_1.db.User.create({
                name: fullName.trim(),
                username: normalizedUsername,
                email: normalizedEmail,
                hashPassword: hashedPassword,
                genderId: "1",
                birth_location_id: "1",
            });
            const [gender, location] = yield Promise.all([
                db_1.db.Gender.findByPk(newUser.genderId),
                db_1.db.BirthLocation.findByPk(newUser.birth_location_id),
            ]);
            return res.status(201).json({
                success: true,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    username: newUser.username,
                    gender: gender === null || gender === void 0 ? void 0 : gender.type,
                    location: location,
                },
            });
        }
        catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        try {
            const user = yield db_1.db.User.findOne({ where: { email: email.toLowerCase().trim() } });
            if (!user || !user.hashPassword || !(yield bcryptjs_1.default.compare(password, user.hashPassword))) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
            });
            const refreshPlain = crypto_1.default.randomBytes(64).toString("hex");
            const refreshHash = crypto_1.default.createHash("sha256").update(refreshPlain).digest("hex");
            const expiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
            yield db_1.db.RefreshToken.create({
                userId: user.id,
                tokenHash: refreshHash,
                expiresAt,
                revoked: false,
            });
            if (!isDev) {
                (0, cookie_helper_1.setAuthCookies)(res, accessToken, refreshPlain);
            }
            ;
            const payload = {
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            };
            if (isDev) {
                payload.access_token = accessToken;
                payload.refresh_token = refreshPlain;
            }
            return res.json(payload);
        }
        catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const incomingRefreshToken = isDev ? req.body.refreshToken : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!incomingRefreshToken) {
            return res.status(401).json({ success: false, message: "No refresh token provided" });
        }
        const tokenHash = crypto_1.default.createHash("sha256").update(incomingRefreshToken).digest("hex");
        try {
            const existing = yield db_1.db.RefreshToken.findOne({
                where: {
                    tokenHash,
                    revoked: false,
                    expiresAt: { [sequelize_1.Op.gt]: new Date() },
                },
            });
            if (!existing) {
                return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
            }
            yield db_1.db.RefreshToken.destroy({ where: { id: existing.id } });
            const newPlain = crypto_1.default.randomBytes(64).toString("hex");
            const newHash = crypto_1.default.createHash("sha256").update(newPlain).digest("hex");
            const newExpiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
            yield db_1.db.RefreshToken.create({
                userId: existing.userId,
                tokenHash: newHash,
                expiresAt: newExpiresAt,
                revoked: false,
            });
            const newAccessToken = jsonwebtoken_1.default.sign({ userId: existing.userId }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
            });
            if (!isDev) {
                (0, cookie_helper_1.setAuthCookies)(res, newAccessToken, newPlain);
            }
            const payload = {
                success: true,
                message: "Token refreshed successfully",
            };
            if (isDev) {
                payload.access_token = newAccessToken;
                payload.refresh_token = newPlain;
            }
            return res.json(payload);
        }
        catch (error) {
            console.error("refreshToken error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function googleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleClient = new google_auth_library_1.OAuth2Client();
        try {
            const { idToken } = req.body;
            if (!idToken || typeof idToken !== "string") {
                return res.status(400).json({ success: false, message: "idToken is required" });
            }
            const ticket = yield googleClient.verifyIdToken({
                idToken,
                audience: env_1.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.sub) || !payload.email || !payload.email_verified) {
                return res.status(401).json({ success: false, message: "Invalid Google account" });
            }
            const { sub: googleId, email, name } = payload;
            let user = yield db_1.db.User.findOne({ where: { email } });
            if (!user) {
                user = yield db_1.db.User.create({
                    email: email,
                    name: name !== null && name !== void 0 ? name : email.split("@")[0],
                    username: email.split("@")[0],
                    genderId: "1",
                    birth_location_id: "1"
                });
            }
            const existingOAuth = yield db_1.db.OAuthAccount.findOne({
                where: { provider: "google", providerId: googleId }
            });
            if (existingOAuth) {
                existingOAuth.metadata = payload;
                yield existingOAuth.save();
            }
            else {
                yield db_1.db.OAuthAccount.create({
                    userId: user.id,
                    provider: "google",
                    providerId: googleId,
                    metadata: payload
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
            });
            const refreshPlain = crypto_1.default.randomBytes(64).toString("hex");
            const refreshHash = crypto_1.default.createHash("sha256").update(refreshPlain).digest("hex");
            const expiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
            yield db_1.db.RefreshToken.create({
                userId: user.id,
                tokenHash: refreshHash,
                expiresAt,
                revoked: false,
            });
            if (!isDev) {
                (0, cookie_helper_1.setAuthCookies)(res, accessToken, refreshPlain);
            }
            const responseJson = {
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                },
            };
            if (isDev) {
                responseJson.access_token = accessToken;
                responseJson.refresh_token = refreshPlain;
            }
            return res.json(responseJson);
        }
        catch (err) {
            console.error("Google Login Error:", err);
            if (err.name === 'SequelizeDatabaseError') {
                return res.status(500).json({ success: false, message: "Database error during OAuth save. Check timestamp triggers." });
            }
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = isDev ? req.body.refreshToken : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!token) {
            if (!isDev) {
                (0, cookie_helper_1.clearAuthCookies)(res);
            }
            return res.json({ success: true, message: "Already logged out" });
        }
        const hash = crypto_1.default.createHash("sha256").update(token).digest("hex");
        yield db_1.db.RefreshToken.destroy({ where: { tokenHash: hash } });
        if (!isDev) {
            (0, cookie_helper_1.clearAuthCookies)(res);
        }
        return res.json({ success: true, message: "Logged out successfully" });
    });
}
