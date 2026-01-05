"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHorosopeRelationship = initHorosopeRelationship;
function initHorosopeRelationship(models) {
    const { Users, PlanetHouse, Navanshaka, Mahadahsha, AntharDasha, AstrologicalDetails } = models;
    if (!Users)
        return;
    if (PlanetHouse) {
        Users.hasOne(PlanetHouse, { foreignKey: "user_id" });
        PlanetHouse.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (Navanshaka) {
        Users.hasOne(Navanshaka, { foreignKey: "user_id" });
        Navanshaka.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (Mahadahsha) {
        Users.hasMany(Mahadahsha, { foreignKey: "user_id" });
        Mahadahsha.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (AntharDasha) {
        Users.hasMany(AntharDasha, { foreignKey: "user_id" });
        AntharDasha.belongsTo(Users, { foreignKey: "user_id" });
    }
    if (AstrologicalDetails) {
        Users.hasMany(AstrologicalDetails, { foreignKey: "user_id" });
        AstrologicalDetails.belongsTo(Users, { foreignKey: "user_id" });
    }
}
