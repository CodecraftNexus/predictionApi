"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBirthLocationRelationship = initBirthLocationRelationship;
function initBirthLocationRelationship(models) {
    const { User, BirthLocation } = models;
    if (!BirthLocation || !User)
        return;
    BirthLocation.hasMany(User, {
        sourceKey: "id",
        foreignKey: "birth_location_id",
        as: "users",
    });
    User.belongsTo(BirthLocation, {
        foreignKey: "birth_location_id",
        as: "birthLocation",
    });
}
