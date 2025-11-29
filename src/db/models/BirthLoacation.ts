import { sequelize } from "./../sequelize";
import { Model, DataTypes } from "sequelize";
import { BirthLocationAttributes, BirthLocationCreationAttributes } from "../type";

export class BirthLocation
  extends Model<BirthLocationAttributes , BirthLocationCreationAttributes>
  implements BirthLocationAttributes
{
  declare id: string;
  declare name?: string | null;
  declare latitude?: number | null;
  declare longitude?: number | null;
}

BirthLocation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "BirthLocation",
    tableName: "birth_locations",
    timestamps: false,
  }
);


BirthLocation.addHook('afterSync', async () => {
  try {
    const count = await BirthLocation.count();
    if (count === 0) {
      await BirthLocation.bulkCreate([
        { name: 'Not Set Birth Location' , longitude : null, latitude : null  },

      ]);
      console.log('✅ Default birth location seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding default birth location:', error);
  }
});
