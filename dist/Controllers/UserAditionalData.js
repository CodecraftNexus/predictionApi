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
const HorosopeControllers_1 = require("./HorosopeControllers");
const PredictionController_1 = require("./PredictionController");
class FeedbackController {
    static getUserLanguage(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.db.Users.findByPk(userId, {
                    include: [{ model: db_1.db.Language, attributes: ['id', 'name'] }]
                });
                if (!user || !user.Language) {
                    return 'en';
                }
                const languageId = user.Language.id;
                switch (languageId) {
                    case '1':
                    case 1:
                        return 'si';
                    case '2':
                    case 2:
                        return 'en';
                    case '3':
                    case 3:
                        return 'ta';
                    default:
                        return 'si';
                }
            }
            catch (error) {
                console.error('Error getting user language:', error);
                return 'si';
            }
        });
    }
    static formatQuestion(question, language) {
        let questionText;
        let options = null;
        let parentAnswerCondition = question.parent_answer_condition;
        switch (language) {
            case 'ta':
                questionText = question.question_text_ta || question.question_text_en || question.question_text_si;
                break;
            case 'en':
                questionText = question.question_text_en || question.question_text_si;
                break;
            case 'si':
            default:
                questionText = question.question_text_si;
                break;
        }
        if (question.options) {
            try {
                const parsedOptions = typeof question.options === 'string'
                    ? JSON.parse(question.options)
                    : question.options;
                if (parsedOptions && typeof parsedOptions === 'object' && (parsedOptions.si || parsedOptions.en || parsedOptions.ta)) {
                    options = parsedOptions[language] || parsedOptions.en || parsedOptions.si;
                }
                else {
                    options = parsedOptions;
                }
            }
            catch (error) {
                console.error('Error parsing options:', error);
                options = question.options;
            }
        }
        if (parentAnswerCondition) {
            try {
                const parsedCondition = typeof parentAnswerCondition === 'string'
                    ? JSON.parse(parentAnswerCondition)
                    : parentAnswerCondition;
                if (parsedCondition && typeof parsedCondition === 'object' && (parsedCondition.si || parsedCondition.en || parsedCondition.ta)) {
                    parentAnswerCondition = parsedCondition[language] || parsedCondition.en || parsedCondition.si;
                }
                else {
                    parentAnswerCondition = parsedCondition;
                }
            }
            catch (error) {
                console.error('Error parsing parent_answer_condition:', error);
            }
        }
        return {
            id: question.id,
            question_key: question.question_key,
            question_text: questionText,
            question_type: question.question_type,
            options: options,
            parent_question_key: question.parent_question_key,
            parent_answer_condition: parentAnswerCondition,
            display_order: question.display_order,
            category: question.category,
            is_active: question.is_active
        };
    }
    static getQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return res.status(401).json({
                        success: false,
                        message: 'User authentication required'
                    });
                }
                const userLanguage = yield FeedbackController.getUserLanguage(userId);
                const questions = yield models_1.UserFeedbackQuestion.findAll({
                    where: { is_active: true },
                    order: [['display_order', 'ASC']]
                });
                const formattedQuestions = questions.map((q) => FeedbackController.formatQuestion(q, userLanguage));
                return res.json({
                    success: true,
                    language: userLanguage,
                    data: formattedQuestions
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
                const userLanguage = yield FeedbackController.getUserLanguage(userId);
                const answers = yield models_1.UserFeedbackAnswer.findAll({
                    where: { user_id: userId },
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
                    language: userLanguage,
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
                questions.forEach((q) => {
                    questionMap[q.question_key] = q;
                });
                yield models_1.UserFeedbackAnswer.destroy({
                    where: { user_id: userId }
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
                        user_id: userId,
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
                    where: { user_id: userId },
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
                    where: { user_id: userId }
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
                        user_id: userId,
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
                const userLanguage = yield FeedbackController.getUserLanguage(userId);
                const allQuestions = yield models_1.UserFeedbackQuestion.findAll({
                    where: { is_active: true },
                    attributes: ['question_key', 'parent_question_key', 'parent_answer_condition', 'category']
                });
                const userAnswers = yield models_1.UserFeedbackAnswer.findAll({
                    where: { user_id: userId },
                    include: [{
                            model: models_1.UserFeedbackQuestion,
                            as: 'question',
                            attributes: ['question_key', 'question_type']
                        }]
                });
                const answerMap = {};
                userAnswers.forEach((answer) => {
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
                    answerMap[answer.question_key] = value;
                });
                const shouldShowQuestion = (question) => {
                    if (!question.parent_question_key) {
                        return true;
                    }
                    const parentAnswer = answerMap[question.parent_question_key];
                    if (!parentAnswer) {
                        return false;
                    }
                    if (!question.parent_answer_condition) {
                        return true;
                    }
                    let conditionToCheck = question.parent_answer_condition;
                    try {
                        const parsedCondition = typeof conditionToCheck === 'string'
                            ? JSON.parse(conditionToCheck)
                            : conditionToCheck;
                        if (parsedCondition && typeof parsedCondition === 'object' &&
                            (parsedCondition.si || parsedCondition.en || parsedCondition.ta)) {
                            const possibleValues = [
                                parsedCondition.si,
                                parsedCondition.en,
                                parsedCondition.ta
                            ].filter(Boolean);
                            if (Array.isArray(parentAnswer)) {
                                return possibleValues.some(val => parentAnswer.includes(val));
                            }
                            return possibleValues.some(val => parentAnswer.toString() === val.toString());
                        }
                        else {
                            conditionToCheck = parsedCondition;
                        }
                    }
                    catch (error) {
                    }
                    if (Array.isArray(parentAnswer)) {
                        return parentAnswer.includes(conditionToCheck);
                    }
                    return parentAnswer.toString() === conditionToCheck.toString();
                };
                const applicableQuestions = allQuestions.filter(shouldShowQuestion);
                const totalApplicableQuestions = applicableQuestions.length;
                let answeredApplicableQuestions = 0;
                applicableQuestions.forEach((q) => {
                    if (answerMap[q.question_key] !== undefined && answerMap[q.question_key] !== null) {
                        answeredApplicableQuestions++;
                    }
                });
                const hasDeceasedAnswer = answerMap['has_deceased_family'];
                const needsDeceasedInfo = hasDeceasedAnswer === 'yes' ||
                    hasDeceasedAnswer === 'ඔව්' ||
                    hasDeceasedAnswer === 'ஆம்';
                const deceasedMembersCount = yield models_1.DeceasedFamilyMember.count({
                    where: { user_id: userId }
                });
                const hasDeceasedInfo = deceasedMembersCount > 0;
                const categoryStats = {};
                applicableQuestions.forEach((q) => {
                    const category = q.category || 'general';
                    if (!categoryStats[category]) {
                        categoryStats[category] = {
                            total: 0,
                            answered: 0
                        };
                    }
                    categoryStats[category].total++;
                    if (answerMap[q.question_key] !== undefined && answerMap[q.question_key] !== null) {
                        categoryStats[category].answered++;
                    }
                });
                const questionCompletionPercentage = totalApplicableQuestions > 0
                    ? Math.round((answeredApplicableQuestions / totalApplicableQuestions) * 100)
                    : 0;
                const questionsComplete = answeredApplicableQuestions >= totalApplicableQuestions;
                const deceasedComplete = !needsDeceasedInfo || hasDeceasedInfo;
                const isComplete = questionsComplete && deceasedComplete;
                let overallCompletionPercentage = questionCompletionPercentage;
                if (needsDeceasedInfo) {
                    const deceasedWeight = 0.1;
                    const questionWeight = 0.9;
                    const deceasedCompletionValue = hasDeceasedInfo ? 100 : 0;
                    overallCompletionPercentage = Math.round((questionCompletionPercentage * questionWeight) +
                        (deceasedCompletionValue * deceasedWeight));
                }
                const incompleteByCategory = {};
                applicableQuestions.forEach((q) => {
                    const category = q.category || 'general';
                    if (!answerMap[q.question_key]) {
                        if (!incompleteByCategory[category]) {
                            incompleteByCategory[category] = [];
                        }
                        incompleteByCategory[category].push(q.question_key);
                    }
                });
                let statusMessage;
                if (isComplete) {
                    switch (userLanguage) {
                        case 'si':
                            statusMessage = 'ප්‍රතිචාර පෝරමය 100% සම්පූර්ණයි';
                            break;
                        case 'ta':
                            statusMessage = 'கருத்து படிவம் 100% முடிந்துவிட்டது';
                            break;
                        default:
                            statusMessage = 'Feedback form is 100% complete';
                    }
                }
                else if (needsDeceasedInfo && !hasDeceasedInfo) {
                    switch (userLanguage) {
                        case 'si':
                            statusMessage = 'කරුණාකර මියගිය පවුලේ සාමාජික තොරතුරු එකතු කරන්න';
                            break;
                        case 'ta':
                            statusMessage = 'இறந்த குடும்ப உறுப்பினர் தகவல்களை சேர்க்கவும்';
                            break;
                        default:
                            statusMessage = 'Please add deceased family member information';
                    }
                }
                else {
                    const remaining = totalApplicableQuestions - answeredApplicableQuestions;
                    switch (userLanguage) {
                        case 'si':
                            statusMessage = `තවත් ප්‍රශ්න ${remaining}ක් ඉතිරිව තිබේ`;
                            break;
                        case 'ta':
                            statusMessage = `${remaining} கேள்விகள் மீதம் உள்ளன`;
                            break;
                        default:
                            statusMessage = `${remaining} questions remaining`;
                    }
                }
                return res.json({
                    success: true,
                    data: {
                        isComplete,
                        overallCompletionPercentage,
                        questionCompletionPercentage,
                        totalQuestions: allQuestions.length,
                        totalApplicableQuestions,
                        answeredQuestions: answeredApplicableQuestions,
                        unansweredQuestions: totalApplicableQuestions - answeredApplicableQuestions,
                        needsDeceasedInfo,
                        hasDeceasedInfo,
                        deceasedMembersCount,
                        categoryStats: Object.keys(categoryStats).map(category => ({
                            category,
                            total: categoryStats[category].total,
                            answered: categoryStats[category].answered,
                            percentage: Math.round((categoryStats[category].answered / categoryStats[category].total) * 100)
                        })),
                        incompleteByCategory,
                        statusMessage,
                        language: userLanguage
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
                    attributes: ['user_id'],
                    group: ['user_id']
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
    static getAllFeedbacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const minId = req.query.id || "USR-000001";
                const limit = parseInt(req.query.limit) || null;
                let limitClause = '';
                if (limit) {
                    limitClause = `LIMIT ${limit}`;
                }
                const query = `
                SELECT DISTINCT "user_id"
                FROM prediction_feedbacks
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
                    const user = yield db_1.db.Users.findByPk(uid, {
                        include: [
                            { model: db_1.db.Gender },
                            { model: db_1.db.BirthLocation },
                            { model: db_1.db.Language },
                            {
                                model: db_1.db.EducationQualificationsItem,
                                as: "qualifications",
                                through: { attributes: [] },
                                attributes: ["qualifications_name"]
                            },
                            {
                                model: db_1.db.JobsItem,
                                as: "jobs",
                                through: { attributes: [] },
                                attributes: ["jobs_name"]
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
                        dateOfBirth: user.date_of_birth || null,
                        birthTime: user.birth_time || null,
                        gender: ((_a = user.Gender) === null || _a === void 0 ? void 0 : _a.type) || null,
                        whatsappNumber: user.whatsapp_number || null,
                        language: ((_b = user.Language) === null || _b === void 0 ? void 0 : _b.name) || null,
                        education: ((_c = user.qualifications) === null || _c === void 0 ? void 0 : _c.map((item) => item.qualifications_name)) || [],
                        jobs: ((_d = user.jobs) === null || _d === void 0 ? void 0 : _d.map((item) => item.jobs_name)) || [],
                        birthLocation: ((_e = user.birthLocation) === null || _e === void 0 ? void 0 : _e.name) || null,
                        latitude: ((_f = user.birthLocation) === null || _f === void 0 ? void 0 : _f.latitude) || null,
                        longitude: ((_g = user.birthLocation) === null || _g === void 0 ? void 0 : _g.longitude) || null,
                        reference: user.reference || null
                    };
                    const planetId = yield db_1.db.LifeTimePredictions.findAll({
                        where: { user_id: uid },
                        attributes: ["prediction_planet_id"]
                    });
                    const planetIds = planetId.map((item) => item.prediction_planet_id);
                    const allPredictions = [];
                    for (const id of planetIds) {
                        const prediction = yield (0, PredictionController_1.getExistingPredictions)(uid, "", id, true);
                        allPredictions.push(prediction);
                    }
                    const PlanetHouse = yield (0, HorosopeControllers_1.getExistingPlanetHouse)(uid, "en", true);
                    const Navamsaka = yield (0, HorosopeControllers_1.getExistingNavanshaka)(uid, "en", true);
                    const AstroData = yield (0, HorosopeControllers_1.getExistingAstrologicalDetails)(uid, true);
                    const mahadasha = yield (0, HorosopeControllers_1.getExistingMahaDasha)(uid, "en", true);
                    const AntharDasha = yield (0, HorosopeControllers_1.getExistingAntardasha)(uid, "en", true);
                    const answers = yield models_1.UserFeedbackAnswer.findAll({
                        where: { user_id: uid },
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
                        where: { user_id: uid },
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
                    const feedbacks = yield db_1.db.PredictionFeedback.findAll({
                        where: {
                            user_id: uid
                        },
                        include: [
                            {
                                model: db_1.db.PredictionPlanet,
                                as: 'planet',
                                attributes: ['id', 'planet_name']
                            },
                            {
                                model: db_1.db.LifeTimePredictionCategory,
                                as: 'category',
                                attributes: ['id', 'name']
                            }
                        ],
                        attributes: [
                            'id',
                            'prediction_text',
                            'feedback_type',
                            'created_at',
                            'updated_at'
                        ],
                        order: [['id', 'DESC']]
                    });
                    const feedbackPrediction = feedbacks.map(feedback => {
                        var _a, _b;
                        return ({
                            feedback_id: feedback.id,
                            text: feedback.prediction_text,
                            feedback_value: feedback.feedback_type,
                            category_name: (_a = feedback.category) === null || _a === void 0 ? void 0 : _a.name,
                            planet_name: (_b = feedback.planet) === null || _b === void 0 ? void 0 : _b.planet_name,
                            created_at: feedback.created_at,
                            updated_at: feedback.updated_at
                        });
                    });
                    data.push({
                        user_id: uid,
                        profile,
                        answers: formattedAnswers,
                        deceasedFamily,
                        feedbackPrediction,
                        PlanetHouse,
                        Navamsaka,
                        AstroData,
                        mahadasha,
                        AntharDasha,
                        allPredictions
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
