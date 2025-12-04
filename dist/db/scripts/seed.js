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
const sequelize_1 = require("../sequelize");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🌱 Starting database seeding...');
        const queryInterface = sequelize_1.sequelize.getQueryInterface();
        console.log('📝 Seeding gender data...');
        const [genderResults] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM gender');
        if (genderResults[0].count === 0) {
            yield queryInterface.bulkInsert('gender', [
                { type: 'Prefer not to say' },
                { type: 'Male' },
                { type: 'Female' },
                { type: 'Other' }
            ]);
            console.log('✅ Genders seeded successfully');
        }
        else {
            console.log('⚠️  Gender data already exists');
        }
        console.log('📝 Seeding birth location data...');
        const [birthLocationResults] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM birth_locations');
        if (birthLocationResults[0].count === 0) {
            yield queryInterface.bulkInsert('birth_locations', [
                { name: 'Not Set Birth Location', longitude: null, latitude: null }
            ]);
            console.log('✅ Birth location seeded successfully');
        }
        else {
            console.log('⚠️  Birth location data already exists');
        }
        yield seedJobsData(queryInterface);
        yield seedEducationQualificationsData(queryInterface);
        console.log('✅ Seeding completed successfully!');
        yield sequelize_1.sequelize.close();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        yield sequelize_1.sequelize.close();
        process.exit(1);
    }
});
seed();
function seedEducationQualificationsData(queryInterface) {
    throw new Error('Function not implemented.');
}
function seedJobsData(queryInterface) {
    throw new Error('Function not implemented.');
}
