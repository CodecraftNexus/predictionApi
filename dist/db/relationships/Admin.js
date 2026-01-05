"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAdminRelationship = initAdminRelationship;
function initAdminRelationship(models) {
    const { Admins, AdminRefreshToken, AdminOAuthAccount } = models;
    if (!Admins)
        return;
    if (AdminRefreshToken) {
        Admins.hasMany(AdminRefreshToken, { foreignKey: "admin_id" });
        AdminRefreshToken.belongsTo(Admins, { foreignKey: "admin_id" });
    }
    if (AdminOAuthAccount) {
        Admins.hasMany(AdminOAuthAccount, { foreignKey: "admin_id" });
        AdminOAuthAccount.belongsTo(Admins, { foreignKey: "admin_id" });
    }
}
