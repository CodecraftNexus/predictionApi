import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { RefreshTokenAttributes, RefreshTokenCreationAttributes } from "../type";

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revoked?: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["token_hash"] }],
  }
);
