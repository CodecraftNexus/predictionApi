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
exports.exportAllDataToExcel = exports.getAllUsers = exports.getUserCompleteData = void 0;
exports.AdminGoogleLogin = AdminGoogleLogin;
exports.AdminRefreshToken = AdminRefreshToken;
exports.AdminLogout = AdminLogout;
exports.GetAdminProfile = GetAdminProfile;
const sequelize_1 = __importDefault(require("sequelize"));
const exceljs_1 = __importDefault(require("exceljs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_2 = require("sequelize");
const db_1 = require("../db");
const env_1 = require("../config/env");
const parseDuratin_1 = __importDefault(require("../utils/parseDuratin"));
const cookie_helper_1 = require("../utils/cookie.helper");
const google_auth_library_1 = require("google-auth-library");
const isDev = env_1.env.NODE_ENV !== "production";
function AdminGoogleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const googleClient = new google_auth_library_1.OAuth2Client();
        try {
            const { idToken } = req.body;
            if (!idToken || typeof idToken !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "idToken is required"
                });
            }
            const ticket = yield googleClient.verifyIdToken({
                idToken,
                audience: env_1.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.sub) || !payload.email || !payload.email_verified) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Google account"
                });
            }
            const { sub: googleId, email, name } = payload;
            let admin = yield db_1.db.Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(403).json({
                    success: false,
                    message: "This email is not registered as an admin. Please contact system administrator."
                });
            }
            const existingOAuth = yield db_1.db.AdminOAuthAccount.findOne({
                where: { provider: "google", providerId: googleId }
            });
            yield db_1.db.sequelize.query(`
          CREATE OR REPLACE FUNCTION update_timestamp() RETURNS trigger AS $$
          BEGIN
             NEW."updatedAt" = CURRENT_TIMESTAMP;
             RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
        `);
            if (existingOAuth) {
                existingOAuth.metadata = payload;
                yield existingOAuth.save();
            }
            else {
                yield db_1.db.AdminOAuthAccount.create({
                    adminId: admin.id,
                    provider: "google",
                    providerId: googleId,
                    metadata: payload
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ adminId: admin.id, isAdmin: true }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
            });
            const refreshPlain = crypto_1.default.randomBytes(64).toString("hex");
            const refreshHash = crypto_1.default.createHash("sha256").update(refreshPlain).digest("hex");
            const expiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
            yield db_1.db.AdminRefreshToken.create({
                adminId: admin.id,
                tokenHash: refreshHash,
                expiresAt,
                revoked: false
            });
            if (!isDev) {
                (0, cookie_helper_1.setAuthCookies)(res, accessToken, refreshPlain);
            }
            const responseJson = {
                success: true,
                message: "Admin login successful",
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                }
            };
            if (isDev) {
                responseJson.access_token = accessToken;
                responseJson.refresh_token = refreshPlain;
            }
            return res.json(responseJson);
        }
        catch (err) {
            console.error("Admin Google Login Error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function AdminRefreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const incomingRefreshToken = isDev ? req.body.refreshToken : (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }
        const tokenHash = crypto_1.default.createHash("sha256").update(incomingRefreshToken).digest("hex");
        try {
            const existing = yield db_1.db.AdminRefreshToken.findOne({
                where: {
                    tokenHash,
                    revoked: false,
                    expiresAt: { [sequelize_2.Op.gt]: new Date() }
                }
            });
            if (!existing) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired refresh token"
                });
            }
            yield db_1.db.AdminRefreshToken.destroy({ where: { id: existing.id } });
            const newPlain = crypto_1.default.randomBytes(64).toString("hex");
            const newHash = crypto_1.default.createHash("sha256").update(newPlain).digest("hex");
            const newExpiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
            yield db_1.db.AdminRefreshToken.create({
                adminId: existing.adminId,
                tokenHash: newHash,
                expiresAt: newExpiresAt,
                revoked: false
            });
            const newAccessToken = jsonwebtoken_1.default.sign({ adminId: existing.adminId, isAdmin: true }, env_1.env.JWT_SECRET, {
                expiresIn: env_1.env.ACCESS_TOKEN_EXPIRES_IN,
            });
            if (!isDev) {
                (0, cookie_helper_1.setAuthCookies)(res, newAccessToken, newPlain);
            }
            const payload = {
                success: true,
                message: "Token refreshed successfully"
            };
            if (isDev) {
                payload.access_token = newAccessToken;
                payload.refresh_token = newPlain;
            }
            return res.json(payload);
        }
        catch (error) {
            console.error("Admin refreshToken error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function AdminLogout(req, res) {
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
        yield db_1.db.AdminRefreshToken.destroy({ where: { tokenHash: hash } });
        if (!isDev) {
            (0, cookie_helper_1.clearAuthCookies)(res);
        }
        return res.json({ success: true, message: "Logged out successfully" });
    });
}
function GetAdminProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.adminId;
            const admin = yield db_1.db.Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }
            return res.json({
                success: true,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                }
            });
        }
        catch (error) {
            console.error('Get Admin Profile error:', error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
const getUserCompleteData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId || isNaN(Number(userId))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }
        const user = yield db_1.db.User.findByPk(userId, {
            include: [
                {
                    model: db_1.db.Gender,
                    as: 'gender',
                    attributes: ['id', 'type']
                },
                {
                    model: db_1.db.BirthLocation,
                    as: 'birthLocation',
                    attributes: ['id', 'name', 'longitude', 'latitude']
                }
            ],
            attributes: { exclude: ['hashPassword'] }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const [profileImages, planetHouses, navamsakas, dashaBalances, antharDashas, astrologicalDetails, predictions, jobs, educations,] = yield Promise.all([
            db_1.db.ProfileImage.findAll({
                where: { userId },
                attributes: ['id', 'imagePath'],
                limit: 10
            }),
            db_1.db.PalentHouse.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                limit: 10
            }),
            db_1.db.Navamsaka.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                limit: 10
            }),
            db_1.db.DashaBalance.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                order: [['From', 'ASC']],
                limit: 50
            }),
            db_1.db.AntharDasha.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                order: [['setNo', 'ASC'], ['From', 'ASC']],
                limit: 100
            }),
            db_1.db.AstrologicalDetails.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                limit: 10
            }),
            db_1.db.Predictions.findAll({
                where: { userId },
                attributes: { exclude: ['userId'] },
                limit: 50
            }),
            db_1.db.Jobs.findAll({
                where: { userId },
                attributes: ['id', 'JobItemId'],
                limit: 20
            }),
            db_1.db.Educationqualifications.findAll({
                where: { userId },
                attributes: ['id', 'EducationqualificationsItemId'],
                limit: 20
            }),
        ]);
        const today = new Date().toISOString().split('T')[0];
        let currentDasha = null;
        let currentMahadashaSet = null;
        let currentIndex = -1;
        for (let i = 0; i < dashaBalances.length; i++) {
            const record = dashaBalances[i];
            if (today >= record.From && today < record.To) {
                currentDasha = {
                    dasha: record.dashawa,
                    from: record.From,
                    to: record.To
                };
                currentIndex = i;
                break;
            }
        }
        if (currentIndex !== -1) {
            currentMahadashaSet = [];
            currentMahadashaSet.push({
                dasha: dashaBalances[currentIndex].dashawa,
                from: dashaBalances[currentIndex].From,
                to: dashaBalances[currentIndex].To
            });
            if (currentIndex + 1 < dashaBalances.length) {
                currentMahadashaSet.push({
                    dasha: dashaBalances[currentIndex + 1].dashawa,
                    from: dashaBalances[currentIndex + 1].From,
                    to: dashaBalances[currentIndex + 1].To
                });
            }
        }
        const currentAntardashaRecord = yield db_1.db.AntharDasha.findOne({
            where: {
                userId,
                From: { [sequelize_2.Op.lte]: today },
                To: { [sequelize_2.Op.gte]: today },
            },
        });
        let currentAntardasha = null;
        let currentAntardashaSet = null;
        if (currentAntardashaRecord) {
            currentAntardasha = {
                anthardhashawa: currentAntardashaRecord.anthardhashawa,
                setNo: currentAntardashaRecord.setNo,
                from: currentAntardashaRecord.From,
                to: currentAntardashaRecord.To,
            };
            const currentSet = yield db_1.db.AntharDasha.findAll({
                where: {
                    userId,
                    setNo: currentAntardashaRecord.setNo
                },
                order: [['From', 'ASC']],
            });
            currentAntardashaSet = currentSet.map(rec => ({
                anthardhashawa: rec.anthardhashawa,
                from: rec.From,
                to: rec.To
            }));
        }
        let jobsWithDetails = [];
        if (jobs.length > 0) {
            const jobItemIds = jobs.map(j => j.JobItemId);
            const jobItems = yield db_1.db.JobsItem.findAll({
                where: { id: jobItemIds },
                attributes: ['id', 'JobsName', 'JobCategoryId'],
                include: [{
                        model: db_1.db.JobsCategory,
                        as: 'category',
                        attributes: ['id', 'CategoryName']
                    }]
            });
            const jobItemMap = new Map(jobItems.map(item => [item.id, item]));
            jobsWithDetails = jobs.map(job => {
                var _a;
                const item = jobItemMap.get(job.JobItemId);
                return {
                    id: job.id,
                    jobName: (item === null || item === void 0 ? void 0 : item.JobsName) || null,
                    category: ((_a = item === null || item === void 0 ? void 0 : item.category) === null || _a === void 0 ? void 0 : _a.CategoryName) || null
                };
            });
        }
        let educationsWithDetails = [];
        if (educations.length > 0) {
            const eduItemIds = educations.map(e => e.EducationqualificationsItemId);
            const eduItems = yield db_1.db.EducationqualificationsItem.findAll({
                where: { id: eduItemIds },
            });
            const eduItemMap = new Map(eduItems.map(item => [item.id, item]));
            educationsWithDetails = educations.map(edu => {
                var _a;
                const item = eduItemMap.get(edu.EducationqualificationsItemId);
                return {
                    id: edu.id,
                    qualificationName: (item === null || item === void 0 ? void 0 : item.qualificationsName) || null,
                    category: ((_a = item === null || item === void 0 ? void 0 : item.category) === null || _a === void 0 ? void 0 : _a.CategoryName) || null
                };
            });
        }
        let predictionsWithPlanets = [];
        if (predictions.length > 0) {
            const planetIds = [...new Set(predictions.map(p => p.PredictionPlanetId))];
            const planets = yield db_1.db.PredictionPlanet.findAll({
                where: { id: planetIds },
                attributes: ['id', 'PlanetName']
            });
            const planetMap = new Map(planets.map(p => [p.id, p]));
            predictionsWithPlanets = predictions.map(pred => {
                var _a;
                return ({
                    id: pred.id,
                    planet: ((_a = planetMap.get(pred.PredictionPlanetId)) === null || _a === void 0 ? void 0 : _a.toJSON()) || null,
                    general_prediction: pred.general_prediction,
                    personalised_prediction: pred.personalised_prediction,
                    planet_zodiac_prediction: pred.planet_zodiac_prediction,
                    verbal_location: pred.verbal_location
                });
            });
        }
        const completeData = {
            success: true,
            data: {
                personalInfo: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    nikname: user.nikname,
                    dateOfBirth: user.dateOfBirth,
                    birthTime: user.birthTime,
                    WhatsappNumber: user.WhatsappNumber,
                    reference: user.reference,
                    gender: user.gender,
                    birthLocation: user.birthLocation,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                profileImages,
                astrologicalData: {
                    planetHouse: planetHouses[0] || null,
                    navamsaka: navamsakas[0] || null,
                    dashaBalance: dashaBalances,
                    antharDasha: antharDashas,
                    astrologicalDetails: astrologicalDetails[0] || null,
                    current_dasha: currentDasha,
                    current_mahadasha_set: currentMahadashaSet,
                    current_antardasha: currentAntardasha,
                    current_antardasha_set: currentAntardashaSet
                },
                predictions: predictionsWithPlanets,
                employment: jobsWithDetails,
                education: educationsWithDetails,
            }
        };
        return res.status(200).json(completeData);
    }
    catch (error) {
        console.error('Error fetching user complete data:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getUserCompleteData = getUserCompleteData;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const whereClause = { reference: { [sequelize_2.Op.or]: [null, ""] } };
        if (search) {
            whereClause[sequelize_2.Op.and] = {
                [sequelize_2.Op.or]: [
                    { name: { [sequelize_2.Op.like]: `%${search}%` } },
                    { email: { [sequelize_2.Op.like]: `%${search}%` } },
                    { username: { [sequelize_2.Op.like]: `%${search}%` } }
                ]
            };
        }
        const count = yield db_1.db.User.count({
            where: whereClause
        });
        const mainUsers = yield db_1.db.User.findAll({
            where: whereClause,
            include: [
                {
                    model: db_1.db.Gender,
                    as: 'gender',
                    attributes: ['id', 'type']
                },
                {
                    model: db_1.db.BirthLocation,
                    as: 'birthLocation',
                    attributes: ['id', 'name']
                }
            ],
            attributes: {
                exclude: ['hashPassword', 'birth_location_id', 'genderId']
            },
            limit: Number(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });
        let users = mainUsers;
        if (mainUsers.length > 0) {
            const mainIds = mainUsers.map(u => String(u.id));
            const subUsers = yield db_1.db.User.findAll({
                where: { reference: { [sequelize_2.Op.in]: mainIds } },
                include: [
                    {
                        model: db_1.db.Gender,
                        as: 'gender',
                        attributes: ['id', 'type']
                    },
                    {
                        model: db_1.db.BirthLocation,
                        as: 'birthLocation',
                        attributes: ['id', 'name']
                    }
                ],
                attributes: {
                    exclude: ['hashPassword', 'birth_location_id', 'genderId']
                },
                order: [['createdAt', 'DESC']]
            });
            const subMap = new Map();
            for (const sub of subUsers) {
                if (!sub.reference)
                    continue;
                const refId = parseInt(sub.reference);
                if (!subMap.has(refId)) {
                    subMap.set(refId, []);
                }
                subMap.get(refId).push(sub);
            }
            users = mainUsers.map(main => {
                const mainJson = main.toJSON();
                mainJson.subUsers = subMap.get(main.id) || [];
                return mainJson;
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    total: count,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(count / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getAllUsers = getAllUsers;
const exportAllDataToExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Complete User Data');
        const allUsers = yield db_1.db.User.findAll({
            include: [
                {
                    model: db_1.db.Gender,
                    as: 'gender',
                    attributes: ['id', 'type']
                },
                {
                    model: db_1.db.BirthLocation,
                    as: 'birthLocation',
                    attributes: ['id', 'name', 'longitude', 'latitude']
                }
            ],
            attributes: { exclude: ['hashPassword'] },
            order: [['id', 'ASC']]
        });
        const predictionPlanets = yield db_1.db.PredictionPlanet.findAll({
            attributes: ['id', 'PlanetName'],
            order: [['id', 'ASC']]
        });
        const planetIdToName = new Map(predictionPlanets.map(p => [p.id, p.PlanetName]));
        const predictionCategories = [
            { key: 'general_prediction', title: 'General Prediction' },
            { key: 'personalised_prediction', title: 'Personalised Prediction' },
            { key: 'planet_zodiac_prediction', title: 'Planet Zodiac Prediction' },
            { key: 'verbal_location', title: 'Verbal Location' }
        ];
        const baseColumns = 50;
        let currentCol = baseColumns + 1;
        const categoryRanges = {};
        let columns = [
            { header: 'User ID', key: 'userId', width: 10 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Nickname', key: 'nickname', width: 20 },
            { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
            { header: 'Birth Time', key: 'birthTime', width: 15 },
            { header: 'WhatsApp Number', key: 'whatsappNumber', width: 20 },
            { header: 'Gender', key: 'gender', width: 15 },
            { header: 'Birth Location', key: 'birthLocation', width: 25 },
            { header: 'Birth Longitude', key: 'birthLongitude', width: 15 },
            { header: 'Birth Latitude', key: 'birthLatitude', width: 15 },
            { header: 'Reference', key: 'reference', width: 15 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 },
            { header: 'PH Lagnaya', key: 'phLagnaya', width: 15 },
            { header: 'PH Box 1', key: 'phBox1', width: 20 },
            { header: 'PH Box 2', key: 'phBox2', width: 20 },
            { header: 'PH Box 3', key: 'phBox3', width: 20 },
            { header: 'PH Box 4', key: 'phBox4', width: 20 },
            { header: 'PH Box 5', key: 'phBox5', width: 20 },
            { header: 'PH Box 6', key: 'phBox6', width: 20 },
            { header: 'PH Box 7', key: 'phBox7', width: 20 },
            { header: 'PH Box 8', key: 'phBox8', width: 20 },
            { header: 'PH Box 9', key: 'phBox9', width: 20 },
            { header: 'PH Box 10', key: 'phBox10', width: 20 },
            { header: 'PH Box 11', key: 'phBox11', width: 20 },
            { header: 'PH Box 12', key: 'phBox12', width: 20 },
            { header: 'Nav Lagnaya', key: 'navLagnaya', width: 15 },
            { header: 'Nav Box 1', key: 'navBox1', width: 20 },
            { header: 'Nav Box 2', key: 'navBox2', width: 20 },
            { header: 'Nav Box 3', key: 'navBox3', width: 20 },
            { header: 'Nav Box 4', key: 'navBox4', width: 20 },
            { header: 'Nav Box 5', key: 'navBox5', width: 20 },
            { header: 'Nav Box 6', key: 'navBox6', width: 20 },
            { header: 'Nav Box 7', key: 'navBox7', width: 20 },
            { header: 'Nav Box 8', key: 'navBox8', width: 20 },
            { header: 'Nav Box 9', key: 'navBox9', width: 20 },
            { header: 'Nav Box 10', key: 'navBox10', width: 20 },
            { header: 'Nav Box 11', key: 'navBox11', width: 20 },
            { header: 'Nav Box 12', key: 'navBox12', width: 20 },
            { header: 'Current Mahadasha', key: 'currentMahadasha', width: 20 },
            { header: 'Mahadasha From', key: 'mahadashaFrom', width: 15 },
            { header: 'Mahadasha To', key: 'mahadashaTo', width: 15 },
            { header: 'Current Antardasha', key: 'currentAntardasha', width: 20 },
            { header: 'Antardasha From', key: 'antardashaFrom', width: 15 },
            { header: 'Antardasha To', key: 'antardashaTo', width: 15 },
            { header: 'Employment', key: 'employment', width: 50 },
            { header: 'Education', key: 'education', width: 50 },
        ];
        for (const category of predictionCategories) {
            const startCol = columns.length + 1;
            for (const planet of predictionPlanets) {
                const planetName = planet.PlanetName;
                const key = `${category.key}_${planetName.toLowerCase().replace(/\s/g, '')}`;
                columns.push({
                    header: planetName,
                    key: key,
                    width: 50
                });
            }
            const endCol = columns.length;
            categoryRanges[category.key] = { start: startCol, end: endCol, title: category.title };
        }
        worksheet.columns = columns;
        worksheet.spliceRows(1, 0, []);
        let colIndex = columns.length - (predictionCategories.length * predictionPlanets.length) + 1;
        for (const category of predictionCategories) {
            const range = categoryRanges[category.key];
            const startLetter = worksheet.getColumn(range.start).letter;
            const endLetter = worksheet.getColumn(range.end).letter;
            worksheet.mergeCells(`${startLetter}1:${endLetter}1`);
            const cell = worksheet.getCell(`${startLetter}1`);
            cell.value = category.title;
            cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF2563EB' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
        const headerRow = worksheet.getRow(2);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F46E5' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        for (const user of allUsers) {
            const userId = user.id;
            const planetHouse = yield db_1.db.PalentHouse.findOne({
                where: { userId }
            });
            const navamsaka = yield db_1.db.Navamsaka.findOne({
                where: { userId }
            });
            const today = new Date().toISOString().split('T')[0];
            const currentDasha = yield db_1.db.DashaBalance.findOne({
                where: {
                    userId,
                    From: { [sequelize_1.default.Op.lte]: today },
                    To: { [sequelize_1.default.Op.gte]: today }
                }
            });
            const currentAntardasha = yield db_1.db.AntharDasha.findOne({
                where: {
                    userId,
                    From: { [sequelize_1.default.Op.lte]: today },
                    To: { [sequelize_1.default.Op.gte]: today }
                }
            });
            const jobs = yield db_1.db.Jobs.findAll({
                where: { userId },
                attributes: ['id', 'JobItemId']
            });
            let employmentText = '';
            if (jobs.length > 0) {
                const jobItemIds = jobs.map((j) => j.JobItemId);
                const jobItems = yield db_1.db.JobsItem.findAll({
                    where: { id: jobItemIds },
                    attributes: ['id', 'JobsName', 'JobCategoryId'],
                    include: [{
                            model: db_1.db.JobsCategory,
                            as: 'category',
                            attributes: ['id', 'CategoryName']
                        }]
                });
                const jobItemMap = new Map(jobItems.map((item) => [item.id, item]));
                employmentText = jobs
                    .map((job) => {
                    var _a;
                    const item = jobItemMap.get(job.JobItemId);
                    const jobName = (item === null || item === void 0 ? void 0 : item.JobsName) || '';
                    const category = ((_a = item === null || item === void 0 ? void 0 : item.category) === null || _a === void 0 ? void 0 : _a.CategoryName) || '';
                    return category ? `${jobName} (${category})` : jobName;
                })
                    .filter(Boolean)
                    .join(', ');
            }
            const educations = yield db_1.db.Educationqualifications.findAll({
                where: { userId },
                attributes: ['id', 'EducationqualificationsItemId']
            });
            let educationText = '';
            if (educations.length > 0) {
                const eduItemIds = educations.map((e) => e.EducationqualificationsItemId);
                const eduItems = yield db_1.db.EducationqualificationsItem.findAll({
                    where: { id: eduItemIds },
                    attributes: ['id', 'qualificationsName']
                });
                const eduItemMap = new Map(eduItems.map((item) => [item.id, item]));
                educationText = educations
                    .map((edu) => {
                    const item = eduItemMap.get(edu.EducationqualificationsItemId);
                    return (item === null || item === void 0 ? void 0 : item.qualificationsName) || '';
                })
                    .filter(Boolean)
                    .join(', ');
            }
            const predictions = yield db_1.db.Predictions.findAll({
                where: { userId }
            });
            let rowData = {
                userId: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                nickname: user.nikname,
                dateOfBirth: user.dateOfBirth,
                birthTime: user.birthTime,
                whatsappNumber: user.WhatsappNumber,
                gender: ((_a = user.gender) === null || _a === void 0 ? void 0 : _a.type) || '',
                birthLocation: ((_b = user.birthLocation) === null || _b === void 0 ? void 0 : _b.name) || '',
                birthLongitude: ((_c = user.birthLocation) === null || _c === void 0 ? void 0 : _c.longitude) || '',
                birthLatitude: ((_d = user.birthLocation) === null || _d === void 0 ? void 0 : _d.latitude) || '',
                reference: user.reference,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                phLagnaya: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.lagnaya) || '',
                phBox1: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box1) || '',
                phBox2: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box2) || '',
                phBox3: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box3) || '',
                phBox4: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box4) || '',
                phBox5: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box5) || '',
                phBox6: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box6) || '',
                phBox7: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box7) || '',
                phBox8: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box8) || '',
                phBox9: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box9) || '',
                phBox10: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box10) || '',
                phBox11: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box11) || '',
                phBox12: (planetHouse === null || planetHouse === void 0 ? void 0 : planetHouse.box12) || '',
                navLagnaya: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.lagnaya) || '',
                navBox1: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box1) || '',
                navBox2: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box2) || '',
                navBox3: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box3) || '',
                navBox4: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box4) || '',
                navBox5: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box5) || '',
                navBox6: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box6) || '',
                navBox7: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box7) || '',
                navBox8: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box8) || '',
                navBox9: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box9) || '',
                navBox10: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box10) || '',
                navBox11: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box11) || '',
                navBox12: (navamsaka === null || navamsaka === void 0 ? void 0 : navamsaka.box12) || '',
                currentMahadasha: (currentDasha === null || currentDasha === void 0 ? void 0 : currentDasha.dashawa) || '',
                mahadashaFrom: (currentDasha === null || currentDasha === void 0 ? void 0 : currentDasha.From) || '',
                mahadashaTo: (currentDasha === null || currentDasha === void 0 ? void 0 : currentDasha.To) || '',
                currentAntardasha: (currentAntardasha === null || currentAntardasha === void 0 ? void 0 : currentAntardasha.anthardhashawa) || '',
                antardashaFrom: (currentAntardasha === null || currentAntardasha === void 0 ? void 0 : currentAntardasha.From) || '',
                antardashaTo: (currentAntardasha === null || currentAntardasha === void 0 ? void 0 : currentAntardasha.To) || '',
                employment: employmentText,
                education: educationText
            };
            if (predictions.length > 0) {
                for (const p of predictions) {
                    const planetName = planetIdToName.get(p.PredictionPlanetId);
                    if (planetName) {
                        const planetKey = planetName.toLowerCase().replace(/\s/g, '');
                        rowData[`general_prediction_${planetKey}`] = p.general_prediction || '';
                        rowData[`personalised_prediction_${planetKey}`] = p.personalised_prediction || '';
                        rowData[`planet_zodiac_prediction_${planetKey}`] = p.planet_zodiac_prediction || '';
                        rowData[`verbal_location_${planetKey}`] = p.verbal_location || '';
                    }
                }
            }
            worksheet.addRow(rowData);
        }
        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 20;
        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 2 }
        ];
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=astrology_complete_data_${new Date().toISOString().split('T')[0]}.xlsx`);
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error('Error exporting data to Excel:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to export data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.exportAllDataToExcel = exportAllDataToExcel;
