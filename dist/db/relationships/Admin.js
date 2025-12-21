"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAdminRelationship = initAdminRelationship;
function initAdminRelationship(models) {
    const { Admin, AdminRefreshToken, AdminOAuthAccount } = models;
    if (!Admin)
        return;
    if (AdminRefreshToken) {
        Admin.hasMany(AdminRefreshToken, { foreignKey: "adminId" });
        AdminRefreshToken.belongsTo(Admin, { foreignKey: "adminId" });
    }
    if (AdminOAuthAccount) {
        Admin.hasMany(AdminOAuthAccount, { foreignKey: "adminId" });
        AdminOAuthAccount.belongsTo(Admin, { foreignKey: "adminId" });
    }
}
