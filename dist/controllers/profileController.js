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
exports.getProfile = getProfile;
exports.UpdateProfile = UpdateProfile;
exports.getJobsOptions = getJobsOptions;
exports.getEducationOptions = getEducationOptions;
const db_1 = require("../db");
const updateProfile_validator_1 = require("../validators/updateProfile.validator");
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const UserId = req.user.userId;
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
            const [gender, location] = yield Promise.all([
                db_1.db.Gender.findByPk(user === null || user === void 0 ? void 0 : user.genderId),
                db_1.db.BirthLocation.findByPk(user === null || user === void 0 ? void 0 : user.birth_location_id),
            ]);
            const payload = {
                id: user === null || user === void 0 ? void 0 : user.id,
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                username: user === null || user === void 0 ? void 0 : user.username,
                dateOfBirth: user === null || user === void 0 ? void 0 : user.dateOfBirth,
                birthTime: user === null || user === void 0 ? void 0 : user.birthTime,
                gender: gender === null || gender === void 0 ? void 0 : gender.type,
                whatsappNumber: user === null || user === void 0 ? void 0 : user.WhatsappNumber,
                education: ((_a = user === null || user === void 0 ? void 0 : user.educationItems) === null || _a === void 0 ? void 0 : _a.map((item) => item.qualificationsName)) || [],
                jobs: ((_b = user === null || user === void 0 ? void 0 : user.jobItems) === null || _b === void 0 ? void 0 : _b.map((item) => item.JobsName)) || [],
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
            console.error(error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
}
function UpdateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
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
            const { dateOfBirth, birthTime, latitude, longitude, birthLocation, gender: genderType, whatsappNumber, jobs, education } = parsed.data;
            const userId = req.user.userId;
            const user = yield db_1.db.User.findByPk(userId, {
                include: [
                    { model: db_1.db.BirthLocation, as: "birthLocation" },
                    { model: db_1.db.Gender, as: "gender" },
                ],
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            const updates = {};
            if (jobs !== undefined && Array.isArray(jobs)) {
                yield db_1.db.Jobs.destroy({ where: { userId } });
                if (jobs.length > 0) {
                    const jobItems = yield db_1.db.JobsItem.findAll({
                        where: { JobsName: jobs }
                    });
                    const jobRecords = jobItems.map((item) => ({
                        userId,
                        JobItemId: item.id
                    }));
                    yield db_1.db.Jobs.bulkCreate(jobRecords);
                }
            }
            if (education !== undefined && Array.isArray(education)) {
                yield db_1.db.Educationqualifications.destroy({ where: { userId } });
                if (education.length > 0) {
                    const eduItems = yield db_1.db.EducationqualificationsItem.findAll({
                        where: { qualificationsName: education }
                    });
                    const eduRecord = eduItems.map((item) => ({
                        userId,
                        EducationqualificationsItemId: item.id
                    }));
                    yield db_1.db.Educationqualifications.bulkCreate(eduRecord);
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
                    });
                    if (!location) {
                        location = yield db_1.db.BirthLocation.create({
                            name: name,
                            latitude: lat,
                            longitude: lng,
                        });
                    }
                    updates.birth_location_id = location.id;
                }
                else if (name === "" && (latitude !== undefined || longitude !== undefined)) {
                    updates.birth_location_id = null;
                }
            }
            if (Object.keys(updates).length === 0) {
                return res.json({
                    success: true,
                    message: "No changes detected",
                    user,
                });
            }
            yield user.update(updates);
            yield user.reload({
                include: [
                    { model: db_1.db.BirthLocation, as: "birthLocation" },
                    { model: db_1.db.Gender, as: "gender" },
                ],
            });
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
            });
            return res.json({
                success: true,
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    dateOfBirth: user.dateOfBirth,
                    birthTime: user.birthTime,
                    whatsappNumber: user.WhatsappNumber,
                    gender: ((_a = user.gender) === null || _a === void 0 ? void 0 : _a.type) || null,
                    jobs: ((_b = user.jobItems) === null || _b === void 0 ? void 0 : _b.map((item) => item.JobName)) || [],
                    education: ((_c = user.educationItems) === null || _c === void 0 ? void 0 : _c.map((item) => item.qualificationsName)) || [],
                    birthLocation: user.birthLocation ? {
                        id: user.birthLocation.id,
                        name: user.birthLocation.name,
                        latitude: user.birthLocation.latitude,
                        longitude: user.birthLocation.longitude,
                    } : null,
                },
            });
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
