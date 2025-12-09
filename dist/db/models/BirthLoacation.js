"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthLocation = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class BirthLocation extends sequelize_2.Model {
}
exports.BirthLocation = BirthLocation;
BirthLocation.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: true,
    },
    longitude: {
        type: sequelize_2.DataTypes.DOUBLE,
        allowNull: true,
    },
    latitude: {
        type: sequelize_2.DataTypes.DOUBLE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "BirthLocation",
    tableName: "birth_locations",
    timestamps: false,
});
BirthLocation.addHook('afterSync', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield BirthLocation.count();
        if (count === 0) {
            yield BirthLocation.bulkCreate([
                { name: 'Not Set Birth Location', longitude: null, latitude: null },
            ]);
            console.log('✅ Default birth location seeded successfully');
        }
    }
    catch (error) {
        console.error('❌ Error seeding default birth location:', error);
    }
}));
