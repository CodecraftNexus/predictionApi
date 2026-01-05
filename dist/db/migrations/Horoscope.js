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
exports.runHoroscopeMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createPlanetHouseTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating planet_houses Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('planet_houses')) {
        console.log('⚠️  planet_houses table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable("planet_houses", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        lagnaya: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        box1: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box2: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box3: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box4: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box5: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box6: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box7: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box8: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box9: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box10: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box11: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box12: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
    });
    yield queryInterface.addIndex('planet_houses', ['user_id']);
    console.log('✅ planet_houses Table created successfully!');
});
const createNavanshakaTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating navanshaka Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('navanshaka')) {
        console.log('⚠️  navanshaka table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable("navanshaka", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        lagnaya: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        box1: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box2: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box3: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box4: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box5: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box6: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box7: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box8: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box9: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box10: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box11: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        box12: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
    });
    yield queryInterface.addIndex('navanshaka', ['user_id']);
    console.log('✅ navanshaka Table created successfully!');
});
const createMahadahshaTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating mahadahsha Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('mahadahsha')) {
        console.log('⚠️  mahadahsha table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('mahadahsha', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        dashawa: {
            type: sequelize_1.DataTypes.STRING(150),
            allowNull: false,
        },
        from: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
        to: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
        },
    });
    yield queryInterface.addIndex('mahadahsha', ['user_id']);
    console.log('✅ mahadahsha Table created successfully!');
});
const createAntharDashaTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating anthar_dasha Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('anthar_dasha')) {
        console.log('⚠️  anthar_dasha table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('anthar_dasha', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        anthardhashawa: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false
        },
        set_no: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        from: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        },
        to: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        }
    });
    yield queryInterface.addIndex('anthar_dasha', ['user_id']);
    console.log('✅ anthar_dasha Table created successfully!');
});
const runHoroscopeMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createPlanetHouseTable(queryInterface);
        yield createNavanshakaTable(queryInterface);
        yield createMahadahshaTable(queryInterface);
        yield createAntharDashaTable(queryInterface);
        console.log('🎉 Horoscope migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
});
exports.runHoroscopeMigrations = runHoroscopeMigrations;
