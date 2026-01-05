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
exports.runMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const Admin_1 = require("./Admin");
const Horoscope_1 = require("./Horoscope");
const Prediction_1 = require("./Prediction");
const Users_1 = require("./Users");
const UserDetailsAdditional_1 = require("./UserDetailsAdditional");
const createApiKeyTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating api_key table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('api_key')) {
        console.log('⚠️ api_key table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('api_key', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: sequelize_1.DataTypes.STRING(250),
            allowNull: false,
        }
    });
    yield queryInterface.addIndex('api_key', ['key'], {
        unique: true,
        name: 'idx_api_key_unique'
    });
    console.log('✅ api_key table created successfully!');
});
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_2.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        const dialect = sequelize_2.sequelize.getDialect();
        if (dialect === 'postgres') {
            yield queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
        }
        yield (0, Users_1.runUserMigrations)();
        yield (0, Admin_1.runAdminMigrations)();
        yield (0, Horoscope_1.runHoroscopeMigrations)();
        yield (0, Prediction_1.runPredictionMigrations)();
        yield (0, UserDetailsAdditional_1.runUserAdditionalMigrations)();
        yield createApiKeyTable(queryInterface);
        console.log('🎉 All migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
});
exports.runMigrations = runMigrations;
