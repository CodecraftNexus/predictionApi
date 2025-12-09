"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGenderRelationship = initGenderRelationship;
function initGenderRelationship(models) {
    const { User, Gender } = models;
    if (!Gender || !User)
        return;
    Gender.hasMany(User, {
        sourceKey: "id",
        foreignKey: "genderId",
        as: "users",
    });
    User.belongsTo(Gender, {
        foreignKey: "genderId",
        as: "gender",
    });
}
