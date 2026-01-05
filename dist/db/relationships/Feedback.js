"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFeedbackRelationships = initFeedbackRelationships;
function initFeedbackRelationships(models) {
    const { Users, UserFeedbackAnswer, DeceasedFamilyMember, BirthLocation, UserFeedbackQuestion } = models;
    if (Users && UserFeedbackAnswer) {
        Users.hasMany(UserFeedbackAnswer, { foreignKey: "user_id", as: "feedbackAnswers" });
        UserFeedbackAnswer.belongsTo(Users, { foreignKey: "user_id", as: "user" });
    }
    if (Users && DeceasedFamilyMember) {
        Users.hasMany(DeceasedFamilyMember, { foreignKey: "user_id", as: "deceasedFamilyMembers" });
        DeceasedFamilyMember.belongsTo(Users, { foreignKey: "user_id", as: "user" });
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
