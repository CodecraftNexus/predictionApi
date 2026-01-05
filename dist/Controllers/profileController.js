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
exports.getEducationOptions = exports.getJobsOptions = exports.switchProfile = exports.addnewProfile = exports.UpdateProfile = exports.getProfile = void 0;
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const updateProfile_validator_1 = require("../validators/updateProfile.validator");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const parseDuratin_1 = __importDefault(require("../utils/parseDuratin"));
const crypto_1 = __importDefault(require("crypto"));
const cookie_helper_1 = require("../utils/cookie.helper");
exports.getProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const UserId = req.user.userId;
    let profiles = [];
    let mainUser = null;
    const Users = db_1.db.Users;
    if (req.profile && req.profile.profileId) {
        profiles = yield Users.findAll({
            where: { reference: req.profile.profileId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        const result = yield Users.findOne({
            where: { id: req.profile.profileId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        if (!result) {
            return res.status(404).json({ success: false, message: "Main user not found" });
        }
        mainUser = {
            id: (result === null || result === void 0 ? void 0 : result.id) || null,
            name: (result === null || result === void 0 ? void 0 : result.name) || null,
            nikname: (result === null || result === void 0 ? void 0 : result.nikname) || null,
            profileImg: ((_b = (_a = result === null || result === void 0 ? void 0 : result.ProfileImages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.imagePath) || null,
        };
    }
    else {
        profiles = yield Users.findAll({
            where: { reference: UserId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        const result = yield Users.findOne({
            where: { id: UserId },
            include: [{ model: db_1.db.ProfileImage, as: "profileImage" }],
        });
        if (!result) {
            return res.status(404).json({ success: false, message: "Main user not found" });
        }
        mainUser = {
            id: (result === null || result === void 0 ? void 0 : result.id) || null,
            name: (result === null || result === void 0 ? void 0 : result.name) || null,
            nikname: (result === null || result === void 0 ? void 0 : result.nikname) || null,
            profileImg: ((_d = (_c = result === null || result === void 0 ? void 0 : result.ProfileImages) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.imagePath) || null,
        };
    }
    const user = yield Users.findByPk(UserId, {
        include: [
            {
                model: db_1.db.Gender,
                attributes: ['id', 'type'],
            },
            {
                model: db_1.db.BirthLocation,
                attributes: ['id', 'time_zone', 'name', 'latitude', 'longitude'],
            },
            {
                model: db_1.db.ProfileImage,
                as: "profileImage",
                attributes: ['image_path']
            },
            {
                model: db_1.db.EducationQualificationsItem,
                as: 'qualifications',
                attributes: ["id", "qualifications_name"],
                through: { attributes: [] },
            },
            {
                model: db_1.db.JobsItem,
                as: "jobs",
                through: { attributes: [] },
                attributes: ["id", "jobs_name"]
            },
            {
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }
        ]
    });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const userWithRelations = user;
    const payload = {
        id: userWithRelations.id || null,
        name: userWithRelations.name || null,
        email: userWithRelations.email || null,
        username: userWithRelations.username || null,
        dateOfBirth: userWithRelations.date_of_birth || null,
        birthTime: userWithRelations.birth_time || null,
        gender: ((_e = userWithRelations.Gender) === null || _e === void 0 ? void 0 : _e.type) || null,
        whatsappNumber: userWithRelations.whatsapp_number || null,
        education: (_f = userWithRelations.qualifications) === null || _f === void 0 ? void 0 : _f.map((item) => item.qualifications_name),
        jobs: (_g = userWithRelations.jobs) === null || _g === void 0 ? void 0 : _g.map((item) => item.jobs_name),
        profileImage: (_h = userWithRelations.profileImage) === null || _h === void 0 ? void 0 : _h.image_path,
        birthLocation: null,
        latitude: null,
        longitude: null,
        language: ((_j = userWithRelations.Language) === null || _j === void 0 ? void 0 : _j.name) || null,
        profiles: profiles.map((profile) => {
            var _a, _b;
            return ({
                id: (profile === null || profile === void 0 ? void 0 : profile.id) || null,
                name: (profile === null || profile === void 0 ? void 0 : profile.name) || null,
                nikname: (profile === null || profile === void 0 ? void 0 : profile.nikname) || null,
                profileImg: ((_b = (_a = profile === null || profile === void 0 ? void 0 : profile.ProfileImages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.imagePath) || null,
            });
        }) || [],
        mainUser: mainUser,
        reference: (user === null || user === void 0 ? void 0 : user.reference) || null,
        nikname: (user === null || user === void 0 ? void 0 : user.nikname) || null
    };
    if (userWithRelations.BirthLocation && userWithRelations.BirthLocation.id !== '1') {
        payload.birthLocation = userWithRelations.BirthLocation.name;
        payload.latitude = userWithRelations.BirthLocation.latitude;
        payload.longitude = userWithRelations.BirthLocation.longitude;
        payload.timeZone = userWithRelations.BirthLocation.time_zone;
    }
    const isProfileComplete = (userWithRelations.date_of_birth &&
        userWithRelations.birth_time &&
        ((_k = userWithRelations.BirthLocation) === null || _k === void 0 ? void 0 : _k.name) &&
        ((_l = userWithRelations.BirthLocation) === null || _l === void 0 ? void 0 : _l.latitude) &&
        ((_m = userWithRelations.BirthLocation) === null || _m === void 0 ? void 0 : _m.longitude));
    if (isProfileComplete) {
        payload.isProfileComplete = true;
    }
    else {
        payload.isProfileComplete = false;
    }
    return res.json(payload);
}));
exports.UpdateProfile = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const parsed = updateProfile_validator_1.updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message]));
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }
    const { dateOfBirth, birthTime, latitude, longitude, timezone, birthLocation, gender: genderType, whatsappNumber, jobs, education, profileImage, language, } = parsed.data;
    const t = yield db_1.db.sequelize.transaction();
    try {
        const updates = {};
        if (dateOfBirth !== undefined && dateOfBirth !== "") {
            updates.date_of_birth = dateOfBirth;
        }
        if (birthTime !== undefined && birthTime !== "") {
            updates.birth_time = birthTime;
        }
        if (latitude !== undefined &&
            longitude !== undefined &&
            birthLocation !== undefined &&
            timezone !== undefined) {
            let location;
            location = yield db_1.db.BirthLocation.findOne({
                where: {
                    name: birthLocation,
                    latitude: latitude,
                    longitude: longitude,
                    time_zone: timezone
                },
                transaction: t
            });
            if (!location) {
                location = yield db_1.db.BirthLocation.create({
                    name: birthLocation,
                    latitude: latitude,
                    longitude: longitude,
                    time_zone: timezone,
                });
            }
            updates.birth_location_id = location.id;
        }
        if (genderType !== undefined && genderType !== "") {
            if (["Male", "Female", "Other"].includes(genderType)) {
                const [gender] = yield db_1.db.Gender.findOrCreate({
                    where: { type: genderType },
                    defaults: { type: genderType },
                    transaction: t
                });
                updates.gender_id = gender.id;
            }
        }
        if (language !== undefined && language !== "") {
            let formattedLanguage;
            if (language == "si") {
                formattedLanguage = "1";
            }
            else if (language == "en") {
                formattedLanguage = "2";
            }
            else {
                formattedLanguage = "3";
            }
            updates.language_id = formattedLanguage;
        }
        if (whatsappNumber !== undefined) {
            updates.whatsapp_number = whatsappNumber || null;
        }
        if (profileImage && profileImage.startsWith('data:image/')) {
            try {
                const uploadResult = yield cloudinary_1.default.uploader.upload(profileImage);
                const imageUrl = uploadResult.secure_url;
                yield db_1.db.ProfileImage.destroy({ where: { user_id: userId }, transaction: t });
                yield db_1.db.ProfileImage.create({
                    user_id: userId,
                    image_path: imageUrl,
                }, { transaction: t });
            }
            catch (error) {
                console.log(error);
                yield t.rollback();
                return res.status(500).json({
                    success: false,
                    message: "Profile image upload failed",
                });
            }
        }
        if (jobs !== undefined && Array.isArray(jobs)) {
            yield db_1.db.Jobs.destroy({ where: { user_id: userId }, transaction: t });
            if (jobs.length > 0) {
                const jobItems = yield db_1.db.JobsItem.findAll({
                    where: { jobs_name: jobs },
                    transaction: t
                });
                if (jobItems.length > 0) {
                    const jobRecords = jobItems.map((item) => ({
                        user_id: userId,
                        job_item_id: item.id
                    }));
                    yield db_1.db.Jobs.bulkCreate(jobRecords, { transaction: t });
                }
            }
        }
        if (education !== undefined && Array.isArray(education)) {
            yield db_1.db.EducationQualifications.destroy({ where: { user_id: userId }, transaction: t });
            if (education.length > 0) {
                const eduItems = yield db_1.db.EducationQualificationsItem.findAll({
                    where: { qualifications_name: education },
                    transaction: t
                });
                if (eduItems.length > 0) {
                    const eduRecord = eduItems.map((item) => ({
                        user_id: userId,
                        education_qualifications_item_id: item.id
                    }));
                    yield db_1.db.EducationQualifications.bulkCreate(eduRecord, { transaction: t });
                }
            }
        }
        const needsHoroscopeRefresh = 'dateOfBirth' in updates ||
            'birthTime' in updates ||
            'birth_location_id' in updates;
        if (needsHoroscopeRefresh) {
            yield Promise.all([
                db_1.db.PlanetHouse.destroy({ where: { user_id: String(userId) }, transaction: t }),
                db_1.db.Navanshaka.destroy({ where: { user_id: String(userId) }, transaction: t }),
                db_1.db.Mahadahsha.destroy({ where: { user_id: String(userId) }, transaction: t }),
                db_1.db.AntharDasha.destroy({ where: { user_id: String(userId) }, transaction: t }),
                db_1.db.LifeTimePredictions.destroy({ where: { user_id: String(userId) }, transaction: t }),
                db_1.db.AstrologicalDetails.destroy({ where: { user_id: String(userId) }, transaction: t })
            ]);
        }
        if (Object.keys(updates).length === 0 && !profileImage) {
            yield t.rollback();
            return res.json({
                success: true,
                message: "No changes detected",
            });
        }
        const user = yield db_1.db.Users.findByPk(userId, {
            include: [
                { model: db_1.db.BirthLocation },
                { model: db_1.db.Gender }
            ],
            transaction: t
        });
        if (!user) {
            yield t.rollback();
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        yield user.update(updates, { transaction: t });
        yield t.commit();
        return (0, exports.getProfile)(req, res, next);
    }
    catch (error) {
        yield t.rollback();
        throw error;
    }
}));
exports.addnewProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { name, nikname } = req.body;
    if (!name || !nikname) {
        return res.status(400).json({
            success: false,
            message: "Name and nickname are required"
        });
    }
    const existingProfiles = yield db_1.db.Users.findAll({
        where: { reference: String(userId) }
    });
    if (existingProfiles.length >= 10) {
        return res.status(400).json({
            success: false,
            message: "Maximum number of profiles reached"
        });
    }
    const newProfile = yield db_1.db.Users.create({
        name: name,
        nikname: nikname,
        reference: userId,
        birth_location_id: "1",
        gender_id: "1",
        language_id: "1"
    });
    return res.json({
        success: true,
        message: "New profile created successfully",
        profile: {
            id: newProfile.id,
            name: newProfile.name,
            nikname: newProfile.nikname
        }
    });
}));
exports.switchProfile = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.userId;
    const { profileId } = req.body;
    if (!profileId) {
        return res.status(400).json({
            success: false,
            message: "Profile ID is required"
        });
    }
    const targetProfile = yield db_1.db.Users.findByPk(profileId);
    if (!targetProfile) {
        return res.status(404).json({
            success: false,
            message: "Profile not found"
        });
    }
    const currentUser = yield db_1.db.Users.findByPk(currentUserId);
    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found"
        });
    }
    let hasAccess = false;
    let mainUserId;
    let isprofileId = false;
    if (currentUser.reference) {
        mainUserId = currentUser.reference;
    }
    else {
        mainUserId = currentUserId;
    }
    if (profileId === mainUserId) {
        hasAccess = true;
        isprofileId = false;
    }
    else if (targetProfile.reference && targetProfile.reference === mainUserId) {
        hasAccess = true;
        isprofileId = true;
    }
    else if (currentUserId === profileId) {
        hasAccess = true;
        isprofileId = false;
    }
    if (!hasAccess) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You can only switch to profiles that belong to your main account."
        });
    }
    const tokenPayload = {
        userId: profileId,
        ProfileId: isprofileId ? mainUserId : ""
    };
    const accessToken = jsonwebtoken_1.default.sign(tokenPayload, String(env_1.env.JWT_SECRET), {
        expiresIn: (0, parseDuratin_1.default)(env_1.env.ACCESS_TOKEN_EXPIRES_IN)
    });
    const refreshPlain = crypto_1.default.randomBytes(64).toString("hex");
    const refreshHash = crypto_1.default.createHash("sha256").update(refreshPlain).digest("hex");
    const expiresAt = new Date(Date.now() + (0, parseDuratin_1.default)(env_1.env.REFRESH_TOKEN_EXPIRES_IN));
    yield db_1.db.RefreshToken.create({
        user_id: profileId,
        token_hash: refreshHash,
        expires_at: expiresAt,
        revoked: false,
    });
    const isDev = env_1.env.NODE_ENV !== "production";
    if (!isDev) {
        (0, cookie_helper_1.setAuthCookies)(res, accessToken, refreshPlain);
    }
    const responseJson = {
        success: true,
        message: "Profile switched successfully",
        profileId: profileId
    };
    if (isDev) {
        responseJson.access_token = accessToken;
        responseJson.refresh_token = refreshPlain;
    }
    return res.json(responseJson);
}));
function formatCategoryName(name) {
    const [top, sub] = name.split(' - ');
    const formatPart = (part) => {
        let formattedPart = part.replace(/_/g, ' ');
        if (formattedPart === 'a l streams') {
            formattedPart = 'A/L Streams';
        }
        if (formattedPart.toLowerCase() === 'nvq levels') {
            formattedPart = 'NVQ Levels';
        }
        return formattedPart.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };
    return `${formatPart(top)} - ${formatPart(sub)}`;
}
exports.getJobsOptions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield db_1.db.JobsCategory.findAll({
        include: [{ model: db_1.db.JobsItem, as: "JobsItem" }]
    });
    const options = {};
    categories.forEach(cat => {
        const formattedName = cat.category_name;
        options[formattedName] = cat['JobsItem'].map((item) => item.jobs_name);
    });
    return res.json(options);
}));
exports.getEducationOptions = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield db_1.db.EducationQualificationsCategory.findAll({
        include: [{ model: db_1.db.EducationQualificationsItem, as: "EducationqualificationsItems" }]
    });
    const options = {};
    categories.forEach(cat => {
        const formattedName = formatCategoryName(cat.category_name);
        options[formattedName] = cat['EducationqualificationsItems'].map((item) => item.qualifications_name);
    });
    return res.json(options);
}));
