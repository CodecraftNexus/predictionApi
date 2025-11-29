// models/relationships/initBirthLocationRelationship.ts
import type { ModelStatic } from "sequelize";

export function initBirthLocationRelationship(models: Record<string, ModelStatic<any>>) {
  const { User, BirthLocation } = models;

  if (!BirthLocation || !User) return;

  // BirthLocation has many Users
  BirthLocation.hasMany(User, {
    sourceKey: "id",
    foreignKey: "birth_location_id",
    as: "users", // optional but good for clarity
  });

  // User belongs to one BirthLocation (already defined in User model)
  User.belongsTo(BirthLocation, {
    foreignKey: "birth_location_id",
    as: "birthLocation",
  });
}