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
exports.getProfile = getProfile;
exports.switchProfile = switchProfile;
exports.UpdateProfile = UpdateProfile;
exports.getJobsOptions = getJobsOptions;
exports.getEducationOptions = getEducationOptions;
exports.addnewProfile = addnewProfile;
const db_1 = require("../db");
const updateProfile_validator_1 = require("../validators/updateProfile.validator");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const UserId = req.user.userId;
            let profiles = [];
            let mainUser = null;
            if (req.profile && req.profile.profileId) {
                profiles = yield db_1.db.User.findAll({
                    where: { reference: String(req.profile.profileId) },
                    include: [{ model: db_1.db.ProfileImage }],
                });
                const result = yield db_1.db.User.findOne({
                    where: { id: req.profile.profileId },
                    include: [{ model: db_1.db.ProfileImage }],
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
                profiles = yield db_1.db.User.findAll({
                    where: { reference: String(UserId) },
                    include: [{ model: db_1.db.ProfileImage }],
                });
                const result = yield db_1.db.User.findOne({
                    where: { id: UserId },
                    include: [{ model: db_1.db.ProfileImage }],
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
            const User = db_1.db.User;
            const user = yield User.findByPk(UserId, {
                include: [
                    {
                        model: db_1.db.EducationqualificationsItem,
                        as: "educationItems",
                        through: { attributes: [] },
                        attributes: ["id", "qualificationsName"]
                    },
                    {
                        model: db_1.db.JobsItem,
                        as: "jobItems",
                        through: { attributes: [] },
                        attributes: ["id", "JobsName"]
                    }
                ]
            });
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const [gender, location, profileImg] = yield Promise.all([
                db_1.db.Gender.findByPk(user === null || user === void 0 ? void 0 : user.genderId),
                db_1.db.BirthLocation.findByPk(user === null || user === void 0 ? void 0 : user.birth_location_id),
                db_1.db.ProfileImage.findOne({ where: { userId: UserId } })
            ]);
            const payload = {
                id: (user === null || user === void 0 ? void 0 : user.id) || null,
                name: (user === null || user === void 0 ? void 0 : user.name) || null,
                email: (user === null || user === void 0 ? void 0 : user.email) || null,
                username: (user === null || user === void 0 ? void 0 : user.username) || null,
                dateOfBirth: (user === null || user === void 0 ? void 0 : user.dateOfBirth) || null,
                birthTime: (user === null || user === void 0 ? void 0 : user.birthTime) || null,
                gender: (gender === null || gender === void 0 ? void 0 : gender.type) || null,
                whatsappNumber: (user === null || user === void 0 ? void 0 : user.WhatsappNumber) || null,
                education: ((_e = user === null || user === void 0 ? void 0 : user.educationItems) === null || _e === void 0 ? void 0 : _e.map((item) => item.qualificationsName)) || [],
                jobs: ((_f = user === null || user === void 0 ? void 0 : user.jobItems) === null || _f === void 0 ? void 0 : _f.map((item) => item.JobsName)) || [],
                profileImage: profileImg ? profileImg.imagePath : null,
                birthLocation: null,
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
                latitude: null,
                longitude: null,
                reference: (user === null || user === void 0 ? void 0 : user.reference) || null,
                nikname: (user === null || user === void 0 ? void 0 : user.nikname) || null
            };
            if (location && String(location.id) !== "1") {
                payload.birthLocation = location.name;
                payload.latitude = location.latitude;
                payload.longitude = location.longitude;
            }
            const isProfileComplete = (gender === null || gender === void 0 ? void 0 : gender.type) &&
                (user === null || user === void 0 ? void 0 : user.dateOfBirth) &&
                (user === null || user === void 0 ? void 0 : user.birthTime) &&
                (location === null || location === void 0 ? void 0 : location.name) &&
                (location === null || location === void 0 ? void 0 : location.latitude) &&
                (location === null || location === void 0 ? void 0 : location.longitude);
            payload.isProfileComplete = !!isProfileComplete;
            return res.json(payload);
        }
        catch (error) {
            console.error('getProfile error:', error);
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
    });
}
function switchProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUserId = req.user.userId;
            const { profileId } = req.body;
            if (!profileId) {
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                });
            }
            const targetProfile = yield db_1.db.User.findByPk(profileId);
            if (!targetProfile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }
            const currentUser = yield db_1.db.User.findByPk(currentUserId);
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
                mainUserId = parseInt(currentUser.reference);
            }
            else {
                mainUserId = currentUserId;
            }
            if (profileId === mainUserId) {
                hasAccess = true;
                isprofileId = false;
            }
            else if (targetProfile.reference && parseInt(targetProfile.reference) === mainUserId) {
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
            const token = jsonwebtoken_1.default.sign(tokenPayload, env_1.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            const isDev = env_1.env.NODE_ENV !== "production";
            if (!isDev) {
                res.cookie("access_token", token, {
                    httpOnly: true,
                    secure: env_1.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000,
                });
            }
            return res.json({
                success: true,
                message: "Profile switched successfully",
                token: isDev ? token : undefined,
                profileId: profileId
            });
        }
        catch (error) {
            console.error('switchProfile error:', error);
            return res.status(500).json({
                success: false,
                message: "Failed to switch profile"
            });
        }
    });
}
function UpdateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const parsed = updateProfile_validator_1.updateProfileSchema.safeParse(req.body);
            if (!parsed.success) {
                const errors = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message]));
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }
            const { dateOfBirth, birthTime, latitude, longitude, birthLocation, gender: genderType, whatsappNumber, jobs, education, profileImage } = parsed.data;
            const userId = req.user.userId;
            try {
                const [triggerResults] = yield db_1.db.sequelize.query(`
        SELECT tg.tgname 
        FROM pg_trigger tg
        JOIN pg_proc pr ON tg.tgfoid = pr.oid
        JOIN pg_class cl ON tg.tgrelid = cl.oid
        WHERE pr.proname = 'update_timestamp'
        AND cl.relname = 'users'
        AND tg.tgisinternal = false;
      `);
                if (triggerResults.length > 0) {
                    const triggerName = triggerResults[0].tgname;
                    yield db_1.db.sequelize.query(`DROP TRIGGER IF EXISTS "${triggerName}" ON "users";`);
                }
                yield db_1.db.sequelize.query(`DROP FUNCTION IF EXISTS update_timestamp();`);
            }
            catch (e) {
                console.log('Could not drop old trigger/function:', e);
            }
            yield db_1.db.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_timestamp() RETURNS trigger AS $$
      BEGIN
         NEW."updatedAt" = CURRENT_TIMESTAMP;
         RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
            try {
                yield db_1.db.sequelize.query(`
        CREATE TRIGGER update_timestamp BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_timestamp();
      `);
            }
            catch (e) {
                console.log('Trigger already exists or could not be created:', e);
            }
            const t = yield db_1.db.sequelize.transaction();
            try {
                const user = yield db_1.db.User.findByPk(userId, {
                    include: [
                        { model: db_1.db.BirthLocation, as: "birthLocation" },
                        { model: db_1.db.Gender, as: "gender" },
                    ],
                    transaction: t,
                });
                if (!user) {
                    yield t.rollback();
                    return res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                }
                const updates = {};
                if (jobs !== undefined && Array.isArray(jobs)) {
                    yield db_1.db.Jobs.destroy({ where: { userId }, transaction: t });
                    if (jobs.length > 0) {
                        const jobItems = yield db_1.db.JobsItem.findAll({
                            where: { JobsName: jobs },
                            transaction: t,
                        });
                        const jobRecords = jobItems.map((item) => ({
                            userId,
                            JobItemId: item.id
                        }));
                        yield db_1.db.Jobs.bulkCreate(jobRecords, { transaction: t });
                    }
                }
                if (education !== undefined && Array.isArray(education)) {
                    yield db_1.db.Educationqualifications.destroy({ where: { userId }, transaction: t });
                    if (education.length > 0) {
                        const eduItems = yield db_1.db.EducationqualificationsItem.findAll({
                            where: { qualificationsName: education },
                            transaction: t,
                        });
                        const eduRecord = eduItems.map((item) => ({
                            userId,
                            EducationqualificationsItemId: item.id
                        }));
                        yield db_1.db.Educationqualifications.bulkCreate(eduRecord, { transaction: t });
                    }
                }
                if (dateOfBirth !== undefined && dateOfBirth !== "") {
                    updates.dateOfBirth = dateOfBirth;
                }
                if (birthTime !== undefined && birthTime !== "") {
                    updates.birthTime = birthTime;
                }
                if (whatsappNumber !== undefined) {
                    updates.WhatsappNumber = whatsappNumber || null;
                }
                if (genderType !== undefined && genderType !== "") {
                    if (["Male", "Female", "Other"].includes(genderType)) {
                        const [gender] = yield db_1.db.Gender.findOrCreate({
                            where: { type: genderType },
                            defaults: { type: genderType },
                            transaction: t,
                        });
                        updates.genderId = gender.id;
                    }
                    else {
                        updates.genderId = null;
                    }
                }
                if (latitude !== undefined &&
                    longitude !== undefined &&
                    birthLocation !== undefined) {
                    const lat = Number(latitude);
                    const lng = Number(longitude);
                    const name = birthLocation.trim();
                    if (!isNaN(lat) &&
                        !isNaN(lng) &&
                        lat >= -90 && lat <= 90 &&
                        lng >= -180 && lng <= 180 &&
                        name !== "") {
                        let location = yield db_1.db.BirthLocation.findOne({
                            where: {
                                name: name,
                                latitude: lat,
                                longitude: lng,
                            },
                            transaction: t,
                        });
                        if (!location) {
                            location = yield db_1.db.BirthLocation.create({
                                name: name,
                                latitude: lat,
                                longitude: lng,
                            }, { transaction: t });
                        }
                        updates.birth_location_id = location.id;
                    }
                    else if (name === "" && (latitude !== undefined || longitude !== undefined)) {
                        updates.birth_location_id = null;
                    }
                }
                const needsHoroscopeRefresh = 'dateOfBirth' in updates ||
                    'birthTime' in updates ||
                    'birth_location_id' in updates;
                if (profileImage && profileImage.startsWith('data:image/')) {
                    const uploadResult = yield cloudinary_1.default.uploader.upload(profileImage);
                    const imageUrl = uploadResult.secure_url;
                    yield db_1.db.ProfileImage.destroy({ where: { userId }, transaction: t });
                    yield db_1.db.ProfileImage.create({
                        userId,
                        imagePath: imageUrl,
                    }, { transaction: t });
                }
                if (Object.keys(updates).length === 0 && !profileImage) {
                    yield t.commit();
                    return res.json({
                        success: true,
                        message: "No changes detected",
                        user,
                    });
                }
                yield user.update(updates, { transaction: t });
                if (needsHoroscopeRefresh) {
                    yield db_1.db.PalentHouse.destroy({ where: { userId: String(userId) }, transaction: t });
                    yield db_1.db.Navamsaka.destroy({ where: { userId: String(userId) }, transaction: t });
                    yield db_1.db.DashaBalance.destroy({ where: { userId: String(userId) }, transaction: t });
                    yield db_1.db.AntharDasha.destroy({ where: { userId: String(userId) }, transaction: t });
                    yield db_1.db.Predictions.destroy({ where: { userId: String(userId) }, transaction: t });
                    yield db_1.db.AstrologicalDetails.destroy({ where: { userId: String(userId) }, transaction: t });
                }
                yield user.reload({
                    include: [
                        { model: db_1.db.BirthLocation, as: "birthLocation" },
                        { model: db_1.db.Gender, as: "gender" },
                        {
                            model: db_1.db.EducationqualificationsItem,
                            as: "educationItems",
                            through: { attributes: [] }
                        },
                        {
                            model: db_1.db.JobsItem,
                            as: "jobItems",
                            through: { attributes: [] }
                        }
                    ],
                    transaction: t,
                });
                const profileImg = yield db_1.db.ProfileImage.findOne({ where: { userId: user.id }, transaction: t });
                const gender = ((_a = user.gender) === null || _a === void 0 ? void 0 : _a.type) || null;
                const location = user.birthLocation;
                const isProfileComplete = gender &&
                    user.dateOfBirth &&
                    user.birthTime &&
                    (location === null || location === void 0 ? void 0 : location.name) &&
                    (location === null || location === void 0 ? void 0 : location.latitude) &&
                    (location === null || location === void 0 ? void 0 : location.longitude);
                yield t.commit();
                return res.json({
                    success: true,
                    message: "Profile updated successfully",
                    user: {
                        id: user.id,
                        name: user.name || null,
                        email: user.email || null,
                        username: user.username || null,
                        dateOfBirth: user.dateOfBirth || null,
                        birthTime: user.birthTime || null,
                        whatsappNumber: user.WhatsappNumber || null,
                        gender: ((_b = user.gender) === null || _b === void 0 ? void 0 : _b.type) || null,
                        jobs: ((_c = user.jobItems) === null || _c === void 0 ? void 0 : _c.map((item) => item.JobsName)) || [],
                        education: ((_d = user.educationItems) === null || _d === void 0 ? void 0 : _d.map((item) => item.qualificationsName)) || [],
                        birthLocation: ((_e = user.birthLocation) === null || _e === void 0 ? void 0 : _e.name) || null,
                        latitude: ((_f = user.birthLocation) === null || _f === void 0 ? void 0 : _f.latitude) || null,
                        longitude: ((_g = user.birthLocation) === null || _g === void 0 ? void 0 : _g.longitude) || null,
                        profileImage: (profileImg === null || profileImg === void 0 ? void 0 : profileImg.imagePath) || null,
                        isProfileComplete: !!isProfileComplete,
                    },
                });
            }
            catch (error) {
                yield t.rollback();
                throw error;
            }
        }
        catch (error) {
            console.error("UpdateProfile Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            });
        }
    });
}
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
function getJobsOptions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield db_1.db.JobsCategory.findAll({
                include: [{ model: db_1.db.JobsItem, as: "JobsItem" }]
            });
            const options = {};
            categories.forEach(cat => {
                const formattedName = cat.CategoryName;
                options[formattedName] = cat['JobsItem'].map((item) => item.JobsName);
            });
            return res.json(options);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    });
}
function getEducationOptions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield db_1.db.EducationqualificationsCatagory.findAll({
                include: [{ model: db_1.db.EducationqualificationsItem, as: "EducationqualificationsItems" }]
            });
            const options = {};
            categories.forEach(cat => {
                const formattedName = formatCategoryName(cat.CategoryName);
                options[formattedName] = cat['EducationqualificationsItems'].map((item) => item.qualificationsName);
            });
            return res.json(options);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    });
}
function addnewProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const { name, nikname } = req.body;
            if (!name || !nikname) {
                return res.status(400).json({
                    success: false,
                    message: "Name and nickname are required"
                });
            }
            const existingProfiles = yield db_1.db.User.findAll({
                where: { reference: String(userId) }
            });
            if (existingProfiles.length >= 10) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum number of profiles reached"
                });
            }
            const newProfile = yield db_1.db.User.create({
                name: name,
                nikname: nikname,
                reference: userId,
                birth_location_id: "1",
                genderId: "1",
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
        }
        catch (error) {
            console.error('addnewProfile error:', error);
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    });
}
