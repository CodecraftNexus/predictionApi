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
exports.FeedbackController = void 0;
const models_1 = require("../db/models");
const sequelize_1 = require("../db/sequelize");
const sequelize_2 = require("sequelize");
const db_1 = require("../db");
class FeedbackController {
    static getQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield models_1.UserFeedbackQuestion.findAll({
                    where: { is_active: true },
                    order: [['display_order', 'ASC']]
                });
                return res.json({
                    success: true,
                    data: questions
                });
            }
            catch (error) {
                console.error('Error fetching questions:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch questions',
                    error: error.message
                });
            }
        });
    }
    static getUserAnswers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID is required'
                    });
                }
                const answers = yield models_1.UserFeedbackAnswer.findAll({
                    where: { userId },
                    include: [{
                            model: models_1.UserFeedbackQuestion,
                            as: 'question'
                        }]
                });
                const formattedAnswers = {};
                answers.forEach((answer) => {
                    const question = answer.question;
                    let value = null;
                    switch (question.question_type) {
                        case 'yes_no':
                        case 'text':
                        case 'select':
                        case 'color':
                            value = answer.answer_text;
                            break;
                        case 'number':
                        case 'year':
                            value = answer.answer_number;
                            break;
                        case 'date':
                            value = answer.answer_date;
                            break;
                        case 'multi_select':
                            value = answer.answer_json;
                            break;
                    }
                    formattedAnswers[answer.question_key] = value;
                });
                return res.json({
                    success: true,
                    data: formattedAnswers
                });
            }
            catch (error) {
                console.error('Error fetching answers:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch answers',
                    error: error.message
                });
            }
        });
    }
    static saveAnswers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { answers } = req.body;
                if (!userId || !answers) {
                    return res.status(400).json({
                        success: false,
                        message: 'userId and answers are required'
                    });
                }
                const questions = yield models_1.UserFeedbackQuestion.findAll();
                const questionMap = {};
                questions.forEach(q => {
                    questionMap[q.question_key] = q;
                });
                yield models_1.UserFeedbackAnswer.destroy({
                    where: { userId: parseInt(userId) }
                });
                const savedAnswers = [];
                for (const [questionKey, value] of Object.entries(answers)) {
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        continue;
                    }
                    const question = questionMap[questionKey];
                    if (!question) {
                        console.warn(`Question not found: ${questionKey}`);
                        continue;
                    }
                    const answerData = {
                        userId: parseInt(userId),
                        question_key: questionKey
                    };
                    switch (question.question_type) {
                        case 'yes_no':
                        case 'text':
                        case 'select':
                        case 'color':
                            answerData.answer_text = value.toString();
                            break;
                        case 'number':
                        case 'year':
                            answerData.answer_number = parseFloat(value);
                            break;
                        case 'date':
                            answerData.answer_date = value;
                            break;
                        case 'multi_select':
                            answerData.answer_json = Array.isArray(value) ? value : [value];
                            break;
                    }
                    const answer = yield models_1.UserFeedbackAnswer.create(answerData);
                    savedAnswers.push(answer);
                }
                return res.json({
                    success: true,
                    message: 'Answers saved successfully',
                    data: {
                        savedCount: savedAnswers.length,
                        answers: savedAnswers
                    }
                });
            }
            catch (error) {
                console.error('Error saving answers:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to save answers',
                    error: error.message
                });
            }
        });
    }
    static getDeceasedFamily(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID is required'
                    });
                }
                const members = yield models_1.DeceasedFamilyMember.findAll({
                    where: { userId: parseInt(userId) },
                    include: [{
                            model: models_1.BirthLocation,
                            as: 'birthLocation'
                        }]
                });
                return res.json({
                    success: true,
                    data: members
                });
            }
            catch (error) {
                console.error('Error fetching deceased family members:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch deceased family members',
                    error: error.message
                });
            }
        });
    }
    static saveDeceasedFamily(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { members } = req.body;
                if (!userId || !Array.isArray(members)) {
                    return res.status(400).json({
                        success: false,
                        message: 'userId and members array are required'
                    });
                }
                yield models_1.DeceasedFamilyMember.destroy({
                    where: { userId: parseInt(userId) }
                });
                const savedMembers = [];
                for (const member of members) {
                    if (!member.relationship) {
                        continue;
                    }
                    let birthLocationId = null;
                    if (member.birth_location) {
                        if (member.latitude && member.longitude) {
                            const [location] = yield models_1.BirthLocation.findOrCreate({
                                where: {
                                    name: member.birth_location,
                                    latitude: parseFloat(member.latitude),
                                    longitude: parseFloat(member.longitude)
                                },
                                defaults: {
                                    name: member.birth_location,
                                    latitude: parseFloat(member.latitude),
                                    longitude: parseFloat(member.longitude)
                                }
                            });
                            birthLocationId = location.id;
                        }
                        else {
                            const [location] = yield models_1.BirthLocation.findOrCreate({
                                where: {
                                    name: member.birth_location
                                },
                                defaults: {
                                    name: member.birth_location,
                                    latitude: null,
                                    longitude: null
                                }
                            });
                            birthLocationId = location.id;
                        }
                    }
                    const savedMember = yield models_1.DeceasedFamilyMember.create({
                        userId: parseInt(userId),
                        relationship: member.relationship,
                        date_of_birth: member.date_of_birth || null,
                        birth_time: member.birth_time || null,
                        birth_location_id: birthLocationId,
                        year_of_death: member.year_of_death ? parseInt(member.year_of_death) : null,
                        cause_of_death: member.cause_of_death || null
                    });
                    savedMembers.push(savedMember);
                }
                return res.json({
                    success: true,
                    message: 'Deceased family members saved successfully',
                    data: {
                        savedCount: savedMembers.length,
                        members: savedMembers
                    }
                });
            }
            catch (error) {
                console.error('Error saving deceased family members:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to save deceased family members',
                    error: error.message
                });
            }
        });
    }
    static deleteDeceasedMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Member ID is required'
                    });
                }
                const deleted = yield models_1.DeceasedFamilyMember.destroy({
                    where: { id: parseInt(id) }
                });
                if (deleted) {
                    return res.json({
                        success: true,
                        message: 'Deceased family member deleted successfully'
                    });
                }
                else {
                    return res.status(404).json({
                        success: false,
                        message: 'Deceased family member not found'
                    });
                }
            }
            catch (error) {
                console.error('Error deleting deceased family member:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete deceased family member',
                    error: error.message
                });
            }
        });
    }
    static getFeedbackStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(400).json({
                        success: false,
                        message: 'User ID is required'
                    });
                }
                const totalQuestions = yield models_1.UserFeedbackQuestion.count({
                    where: {
                        is_active: true,
                        parent_question_key: null
                    }
                });
                const answeredQuestions = yield models_1.UserFeedbackAnswer.count({
                    where: { userId: parseInt(userId) }
                });
                const deceasedMembersCount = yield models_1.DeceasedFamilyMember.count({
                    where: { userId: parseInt(userId) }
                });
                const hasDeceasedAnswer = yield models_1.UserFeedbackAnswer.findOne({
                    where: {
                        userId: parseInt(userId),
                        question_key: 'has_deceased_family'
                    }
                });
                const needsDeceasedInfo = (hasDeceasedAnswer === null || hasDeceasedAnswer === void 0 ? void 0 : hasDeceasedAnswer.answer_text) === 'yes';
                const hasDeceasedInfo = deceasedMembersCount > 0;
                const isComplete = answeredQuestions >= totalQuestions &&
                    (!needsDeceasedInfo || hasDeceasedInfo);
                const completionPercentage = totalQuestions > 0
                    ? Math.round((answeredQuestions / totalQuestions) * 100)
                    : 0;
                return res.json({
                    success: true,
                    data: {
                        totalQuestions,
                        answeredQuestions,
                        deceasedMembersCount,
                        needsDeceasedInfo,
                        hasDeceasedInfo,
                        isComplete,
                        completionPercentage
                    }
                });
            }
            catch (error) {
                console.error('Error fetching feedback status:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch feedback status',
                    error: error.message
                });
            }
        });
    }
    static getFeedbackStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalUsers = yield models_1.UserFeedbackAnswer.findAll({
                    attributes: ['userId'],
                    group: ['userId']
                });
                const totalQuestions = yield models_1.UserFeedbackQuestion.count({
                    where: { is_active: true }
                });
                const totalAnswers = yield models_1.UserFeedbackAnswer.count();
                const totalDeceasedRecords = yield models_1.DeceasedFamilyMember.count();
                const categories = yield models_1.UserFeedbackQuestion.findAll({
                    attributes: ['category'],
                    group: ['category']
                });
                const categoryStats = [];
                for (const cat of categories) {
                    const categoryQuestions = yield models_1.UserFeedbackQuestion.count({
                        where: {
                            category: cat.category,
                            is_active: true
                        }
                    });
                    const categoryAnswers = yield models_1.UserFeedbackAnswer.count({
                        include: [{
                                model: models_1.UserFeedbackQuestion,
                                as: 'question',
                                where: { category: cat.category },
                                required: true
                            }]
                    });
                    categoryStats.push({
                        category: cat.category,
                        questions: categoryQuestions,
                        answers: categoryAnswers,
                        completionRate: categoryQuestions > 0
                            ? Math.round((categoryAnswers / (categoryQuestions * totalUsers.length)) * 100)
                            : 0
                    });
                }
                return res.json({
                    success: true,
                    data: {
                        totalUsers: totalUsers.length,
                        totalQuestions,
                        totalAnswers,
                        totalDeceasedRecords,
                        averageAnswersPerUser: totalUsers.length > 0
                            ? Math.round(totalAnswers / totalUsers.length)
                            : 0,
                        categoryStatistics: categoryStats
                    }
                });
            }
            catch (error) {
                console.error('Error fetching statistics:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch statistics',
                    error: error.message
                });
            }
        });
    }
    ;
    static getAllFeedbacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const minId = parseInt(req.query.id) || 1;
                const limit = parseInt(req.query.limit) || null;
                let limitClause = '';
                if (limit) {
                    limitClause = `LIMIT ${limit}`;
                }
                const query = `
                         SELECT DISTINCT "user_id"
                FROM user_feedback_answers
                WHERE "user_id" >= :minId
                ORDER BY "user_id" ASC
                ${limitClause}
            `;
                const userResults = yield sequelize_1.sequelize.query(query, {
                    replacements: { minId },
                    type: sequelize_2.QueryTypes.SELECT
                });
                const userIds = userResults.map(row => row.user_id);
                if (userIds.length === 0) {
                    return res.json({
                        success: true,
                        data: [],
                        lastUserId: null
                    });
                }
                const data = [];
                for (const uid of userIds) {
                    const user = yield db_1.db.User.findByPk(uid, {
                        include: [
                            { model: db_1.db.Gender, as: 'gender' },
                            { model: db_1.db.BirthLocation, as: 'birthLocation' },
                            {
                                model: db_1.db.EducationqualificationsItem,
                                as: "educationItems",
                                through: { attributes: [] },
                                attributes: ["qualificationsName"]
                            },
                            {
                                model: db_1.db.JobsItem,
                                as: "jobItems",
                                through: { attributes: [] },
                                attributes: ["JobsName"]
                            }
                        ]
                    });
                    if (!user)
                        continue;
                    const profile = {
                        name: user.name || null,
                        nickname: user.nikname || null,
                        email: user.email || null,
                        username: user.username || null,
                        dateOfBirth: user.dateOfBirth || null,
                        birthTime: user.birthTime || null,
                        gender: ((_a = user.gender) === null || _a === void 0 ? void 0 : _a.type) || null,
                        whatsappNumber: user.WhatsappNumber || null,
                        education: user.educationItems.map((item) => item.qualificationsName) || [],
                        jobs: user.jobItems.map((item) => item.JobsName) || [],
                        birthLocation: ((_b = user.birthLocation) === null || _b === void 0 ? void 0 : _b.name) || null,
                        latitude: ((_c = user.birthLocation) === null || _c === void 0 ? void 0 : _c.latitude) || null,
                        longitude: ((_d = user.birthLocation) === null || _d === void 0 ? void 0 : _d.longitude) || null,
                        reference: user.reference || null
                    };
                    const answers = yield models_1.UserFeedbackAnswer.findAll({
                        where: { userId: uid },
                        include: [{
                                model: models_1.UserFeedbackQuestion,
                                as: 'question'
                            }]
                    });
                    const formattedAnswers = {};
                    answers.forEach((answer) => {
                        const question = answer.question;
                        let value = null;
                        switch (question.question_type) {
                            case 'yes_no':
                            case 'text':
                            case 'select':
                            case 'color':
                                value = answer.answer_text;
                                break;
                            case 'number':
                            case 'year':
                                value = answer.answer_number;
                                break;
                            case 'date':
                                value = answer.answer_date;
                                break;
                            case 'multi_select':
                                value = answer.answer_json;
                                break;
                        }
                        formattedAnswers[answer.question_key] = value;
                    });
                    const members = yield models_1.DeceasedFamilyMember.findAll({
                        where: { userId: uid },
                        include: [{
                                model: models_1.BirthLocation,
                                as: 'birthLocation'
                            }]
                    });
                    const deceasedFamily = members.map((m) => {
                        var _a, _b, _c;
                        return ({
                            id: m.id,
                            relationship: m.relationship,
                            date_of_birth: m.date_of_birth,
                            birth_time: m.birth_time,
                            birth_location: (_a = m.birthLocation) === null || _a === void 0 ? void 0 : _a.name,
                            latitude: (_b = m.birthLocation) === null || _b === void 0 ? void 0 : _b.latitude,
                            longitude: (_c = m.birthLocation) === null || _c === void 0 ? void 0 : _c.longitude,
                            year_of_death: m.year_of_death,
                            cause_of_death: m.cause_of_death
                        });
                    });
                    const predQuery = `
                    SELECT 
                        uf.id as feedback_id,
                        pi.id as item_id,
                        pi."itemName" as text,
                        pi.feedback as feedback_value,
                        pc.name as category_name,
                        pp."PlanetName" as planet_name
                    FROM user_feedback as uf
                    INNER JOIN prediction_items pi ON uf."PredictionItemId" = pi.id
                    INNER JOIN prediction_category pc ON pi."predcitonCatId" = pc.id
                    INNER JOIN prediction_planet pp ON pi."PredictionPlanetId" = pp.id
                    WHERE uf."userId" = :userId
                    ORDER BY uf.id DESC
                `;
                    const predResults = yield sequelize_1.sequelize.query(predQuery, {
                        replacements: { userId: uid },
                        type: sequelize_2.QueryTypes.SELECT
                    });
                    const predictionFeedbacks = predResults.map((row) => ({
                        planet: row.planet_name,
                        text: row.text,
                        cat: row.category_name,
                        status: row.feedback_value === '2' ? 'correct' :
                            row.feedback_value === '1' ? 'incorrect' : 'Undecided',
                    }));
                    data.push({
                        userId: uid,
                        profile,
                        answers: formattedAnswers,
                        deceasedFamily,
                        predictionFeedbacks
                    });
                }
                const lastUserId = userIds[userIds.length - 1] || null;
                return res.json({
                    success: true,
                    data,
                    lastUserId
                });
            }
            catch (error) {
                console.error('Error fetching all feedbacks:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch all feedbacks',
                    error: error.message
                });
            }
        });
    }
}
exports.FeedbackController = FeedbackController;
