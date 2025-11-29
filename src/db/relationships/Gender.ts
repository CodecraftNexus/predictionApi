// models/relationships/initGenderRelationship.ts
import type { ModelStatic } from "sequelize";

export function initGenderRelationship(models: Record<string, ModelStatic<any>>) {
  const { User, Gender } = models;

  if (!Gender || !User) return;

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