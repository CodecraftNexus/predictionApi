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
const sequelize_1 = require("../sequelize");
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        const queryInterface = sequelize_1.sequelize.getQueryInterface();
        yield createGenderTable(queryInterface);
        yield createBirthLocationsTable(queryInterface);
        yield createUsersTable(queryInterface);
        yield createRefreshTokensTable(queryInterface);
        yield createOAuthAccountsTable(queryInterface);
        yield createApiKeyTable(queryInterface);
        yield createPlanetHouseTable(queryInterface);
        yield createDashaBalanceTable(queryInterface);
        yield createAntharDashaTable(queryInterface);
        yield createPredictionSunTable(queryInterface);
        yield seedDefaultData(queryInterface);
        console.log('🎉 All migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
});
exports.runMigrations = runMigrations;
const createGenderTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating gender table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('gender')) {
        console.log('⚠️  Gender table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('gender', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: 'VARCHAR(20)',
            allowNull: true
        }
    });
    console.log('✅ Gender table created successfully!');
});
const createBirthLocationsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating birth_locations table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('birth_locations')) {
        console.log('⚠️  Birth locations table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('birth_locations', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: 'TEXT',
            allowNull: true
        },
        longitude: {
            type: 'DOUBLE',
            allowNull: true
        },
        latitude: {
            type: 'DOUBLE',
            allowNull: true
        }
    });
    console.log('✅ Birth locations table created successfully!');
});
const createUsersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating users table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('users')) {
        console.log('⚠️  Users table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('users', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: 'VARCHAR(150)',
            allowNull: false
        },
        email: {
            type: 'VARCHAR(254)',
            allowNull: false,
            unique: true
        },
        dateOfBirth: {
            type: 'DATE',
            allowNull: true
        },
        birthTime: {
            type: 'TIME',
            allowNull: true
        },
        genderId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'gender',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        birth_location_id: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'birth_locations',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        username: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        WhatsappNumber: {
            type: 'VARCHAR(12)',
            allowNull: true
        },
        hashPassword: {
            type: 'VARCHAR(250)',
            allowNull: true
        },
        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('users', ['email']);
    yield queryInterface.addIndex('users', ['username']);
    yield queryInterface.addIndex('users', ['genderId']);
    yield queryInterface.addIndex('users', ['birth_location_id']);
    console.log('✅ Users table created successfully!');
});
const createRefreshTokensTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating refresh_tokens table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('refresh_tokens')) {
        console.log('⚠️  Refresh tokens table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('refresh_tokens', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        token_hash: {
            type: 'VARCHAR(128)',
            allowNull: false
        },
        expires_at: {
            type: 'DATETIME',
            allowNull: false
        },
        revoked: {
            type: 'BOOLEAN',
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('refresh_tokens', ['user_id']);
    yield queryInterface.addIndex('refresh_tokens', ['token_hash']);
    console.log('✅ Refresh tokens table created successfully!');
});
const createOAuthAccountsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating oauth_accounts table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('oauth_accounts')) {
        console.log('⚠️  OAuth accounts table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('oauth_accounts', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        provider: {
            type: 'VARCHAR(50)',
            allowNull: false
        },
        provider_id: {
            type: 'VARCHAR(200)',
            allowNull: false
        },
        access_token: {
            type: 'TEXT',
            allowNull: true
        },
        refresh_token: {
            type: 'TEXT',
            allowNull: true
        },
        metadata: {
            type: 'JSON',
            allowNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('oauth_accounts', ['provider', 'provider_id'], { unique: true });
    yield queryInterface.addIndex('oauth_accounts', ['user_id']);
    console.log('✅ OAuth accounts table created successfully!');
});
const createApiKeyTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating api_key table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('api_key')) {
        console.log('⚠️  API key table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('api_key', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: 'VARCHAR(250)',
            allowNull: false
        }
    });
    console.log('✅ API key table created successfully!');
});
const createPlanetHouseTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating planet_house table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('planet_house')) {
        console.log('⚠️  Planet house table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('planet_house', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        lagnaya: {
            type: 'VARCHAR(50)',
            allowNull: false
        },
        box1: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box2: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box3: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box4: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box5: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box6: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box7: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box8: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box9: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box10: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box11: {
            type: 'VARCHAR(50)',
            allowNull: true
        },
        box12: {
            type: 'VARCHAR(50)',
            allowNull: true
        }
    });
    yield queryInterface.addIndex('planet_house', ['userId']);
    console.log('✅ Planet house table created successfully!');
});
const createDashaBalanceTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating dasha_balance table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('dasha_balance')) {
        console.log('⚠️  Dasha balance table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('dasha_balance', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        dashawa: {
            type: 'VARCHAR(150)',
            allowNull: false
        },
        From: {
            type: 'DATE',
            allowNull: false
        },
        To: {
            type: 'DATE',
            allowNull: false
        }
    });
    yield queryInterface.addIndex('dasha_balance', ['userId']);
    console.log('✅ Dasha balance table created successfully!');
});
const createAntharDashaTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating anthar_dasha table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('anthar_dasha')) {
        console.log('⚠️  Anthar dasha table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('anthar_dasha', {
        id: {
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        anthardhashawa: {
            type: 'VARCHAR(200)',
            allowNull: false
        },
        setNo: {
            type: 'INTEGER',
            allowNull: false
        },
        From: {
            type: 'DATE',
            allowNull: false
        },
        To: {
            type: 'DATE',
            allowNull: false
        }
    });
    yield queryInterface.addIndex('anthar_dasha', ['userId']);
    yield queryInterface.addIndex('anthar_dasha', ['setNo']);
    console.log('✅ Anthar dasha table created successfully!');
});
const createPredictionSunTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Prediction_sun table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('Prediction_sun')) {
        console.log('⚠️  Prediction Sun table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('Prediction_sun', {
        id: {
            type: "INTEGER",
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: "INTEGER",
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        general_prediction: {
            type: "TEXT",
            allowNull: false
        },
        personalised_prediction: {
            type: "TEXT",
            allowNull: false
        },
        planet_zodiac_prediction: {
            type: "TEXT",
            allowNull: false
        },
        verbal_location: {
            type: "VARCHAR(200)",
            allowNull: false
        }
    });
    yield queryInterface.addIndex('Prediction_sun', ['userId']);
    console.log('✅ Prediction sun table created successfully!');
});
const seedDefaultData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding default data...');
    try {
        const [genderResults] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM gender');
        if (genderResults[0].count === 0) {
            yield queryInterface.bulkInsert('gender', [
                { type: 'Prefer not to say' },
                { type: 'Male' },
                { type: 'Female' },
                { type: 'Other' }
            ]);
            console.log('✅ Default genders seeded successfully');
        }
        else {
            console.log('⚠️  Gender data already exists, skipping seed...');
        }
        const [birthLocationResults] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM birth_locations');
        if (birthLocationResults[0].count === 0) {
            yield queryInterface.bulkInsert('birth_locations', [
                { name: 'Not Set Birth Location', longitude: null, latitude: null }
            ]);
            console.log('✅ Default birth location seeded successfully');
        }
        else {
            console.log('⚠️  Birth location data already exists, skipping seed...');
        }
        console.log('✅ All default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
});
