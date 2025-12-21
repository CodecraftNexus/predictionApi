"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFeedbackRelationships = initFeedbackRelationships;
function initFeedbackRelationships(models) {
    const { User, UserFeedbackAnswer, DeceasedFamilyMember, BirthLocation, UserFeedbackQuestion } = models;
    if (User && UserFeedbackAnswer) {
        User.hasMany(UserFeedbackAnswer, { foreignKey: "userId", as: "feedbackAnswers" });
        UserFeedbackAnswer.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
    if (User && DeceasedFamilyMember) {
        User.hasMany(DeceasedFamilyMember, { foreignKey: "userId", as: "deceasedFamilyMembers" });
        DeceasedFamilyMember.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
    if (BirthLocation && DeceasedFamilyMember) {
        DeceasedFamilyMember.belongsTo(BirthLocation, {
            foreignKey: "birth_location_id",
            as: "birthLocation"
        });
    }
    if (UserFeedbackQuestion && UserFeedbackAnswer) {
        UserFeedbackAnswer.belongsTo(UserFeedbackQuestion, {
            foreignKey: "question_key",
            targetKey: "question_key",
            as: "question"
        });
    }
}
