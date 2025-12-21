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
exports.Gender = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Gender extends sequelize_2.Model {
}
exports.Gender = Gender;
Gender.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: sequelize_2.DataTypes.STRING(20),
        allowNull: true,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Gender",
    tableName: "gender",
    timestamps: false,
});
Gender.addHook('afterSync', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield Gender.count();
        if (count === 0) {
            yield Gender.bulkCreate([
                { type: 'Prefer not to say' },
                { type: 'Male' },
                { type: 'Female' },
                { type: 'Other' },
            ]);
            console.log('✅ Default genders seeded successfully');
        }
    }
    catch (error) {
        console.error('❌ Error seeding default genders:', error);
    }
}));
