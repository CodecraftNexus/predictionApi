import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { OAuthAccountAttributes, OAuthAccountCreationAttributes } from "../type";

export class OAuthAccount
  extends Model<OAuthAccountAttributes, OAuthAccountCreationAttributes>
  implements OAuthAccountAttributes
{
  declare id: string;
  declare userId: string;
  declare provider: string;
  declare providerId: string;
  declare accessToken?: string | null;
  declare refreshToken?: string | null;
  declare metadata?: Record<string, any> | null;
}

OAuthAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    providerId: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OAuthAccount",
    tableName: "oauth_accounts",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [{ unique: true, fields: ["provider", "provider_id"] }, { fields: ["user_id"] }],
  }
);
