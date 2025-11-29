import { sequelize } from "../sequelize";
import { Model, DataTypes } from "sequelize";
import { GenderAttributes, GenderCreationAttributes } from "../type";

export class Gender
  extends Model<GenderAttributes, GenderCreationAttributes>
  implements GenderAttributes
{
  declare id: string;
  declare type?: string | null;
}

Gender.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Gender",
    tableName: "gender",
    timestamps : false,
  }
);

Gender.addHook('afterSync', async () => {
  try {
    const count = await Gender.count();
    if (count === 0) {
      await Gender.bulkCreate([
        { type: 'Prefer not to say' },
        { type: 'Male' },
        { type: 'Female' },
        { type: 'Other' },
      ]);
      console.log('✅ Default genders seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding default genders:', error);
  }
});
