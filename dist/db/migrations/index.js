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
const sequelize_2 = require("sequelize");
const Admin_1 = require("./Admin");
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        const queryInterface = sequelize_1.sequelize.getQueryInterface();
        const dialect = sequelize_1.sequelize.getDialect();
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
        yield createGenderTable(queryInterface);
        yield createBirthLocationsTable(queryInterface);
        yield createUsersTable(queryInterface);
        yield createRefreshTokensTable(queryInterface);
        yield createOAuthAccountsTable(queryInterface);
        yield createApiKeyTable(queryInterface);
        yield createPlanetHouseTable(queryInterface);
        yield createDashaBalanceTable(queryInterface);
        yield createAntharDashaTable(queryInterface);
        yield createPredictionPlanetTable(queryInterface);
        yield createPredictionsTable(queryInterface);
        yield createJobsCategoryTable(queryInterface);
        yield createJobsItemTable(queryInterface);
        yield createJobsTable(queryInterface);
        yield createEducationQualificationsCategoryTable(queryInterface);
        yield createEducationQualificationsItemTable(queryInterface);
        yield createEducationQualificationsTable(queryInterface);
        yield createProfileImageTable(queryInterface);
        yield createNavamsakaTable(queryInterface);
        yield createAstrologicalDetailsTable(queryInterface);
        createPlanetLocatinsPredictinsTable(queryInterface);
        yield (0, Admin_1.runAdminMigrations)();
        yield seedDefaultData(queryInterface);
        yield seedPredictionPlanetsData(queryInterface);
        yield createSubscriptionPackagesTable(queryInterface);
        yield createPaymentsTable(queryInterface);
        yield createUserSubscriptionsTable(queryInterface);
        yield seedSubscriptionPackages(queryInterface);
        yield createPredictionCategoryTable(queryInterface);
        yield createPredictionItemsTable(queryInterface);
        yield createUserFeedbackTable(queryInterface);
        yield seedPredictionCategories(queryInterface);
        yield createUserFeedbackQuestionsTable(queryInterface);
        yield createUserFeedbackAnswersTable(queryInterface);
        yield createDeceasedFamilyMembersTable(queryInterface);
        yield seedFeedbackQuestions(queryInterface);
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: sequelize_2.DataTypes.STRING(20),
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: true
        },
        longitude: {
            type: sequelize_2.DataTypes.DOUBLE,
            allowNull: true
        },
        latitude: {
            type: sequelize_2.DataTypes.DOUBLE,
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_2.DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: sequelize_2.DataTypes.STRING(254),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        dateOfBirth: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: true,
        },
        birthTime: {
            type: sequelize_2.DataTypes.TIME,
            allowNull: true,
        },
        genderId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'gender',
                key: 'id'
            },
        },
        birth_location_id: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'birth_locations',
                key: 'id'
            },
        },
        username: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true,
        },
        WhatsappNumber: {
            type: sequelize_2.DataTypes.STRING(12),
            allowNull: true,
        },
        hashPassword: {
            type: sequelize_2.DataTypes.STRING(250),
            allowNull: true,
        },
        reference: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: true,
        },
        nikname: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: true,
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('users', ['email']);
    yield queryInterface.addIndex('users', ['username']);
    yield queryInterface.addIndex('users', ['genderId']);
    yield queryInterface.addIndex('users', ['birth_location_id']);
    const dialect = sequelize_1.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        token_hash: {
            type: sequelize_2.DataTypes.STRING(128),
            allowNull: false
        },
        expires_at: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false
        },
        revoked: {
            type: sequelize_2.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('refresh_tokens', ['user_id']);
    yield queryInterface.addIndex('refresh_tokens', ['token_hash']);
    console.log('✅ Refresh tokens table created successfully!');
});
const createPlanetLocatinsPredictinsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating planet_locatins_predictins table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('planet_locatins_predictins')) {
        console.log('⚠️  Planet locatins predictins table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('planet_locatins_predictins', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lagnaya: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        PredictionPlanetId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_planet',
                key: 'id'
            },
        },
        planetlocation: {
            type: sequelize_2.DataTypes.STRING(5),
            allowNull: false
        },
        prediction: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false
        }
    });
    yield queryInterface.addIndex('planet_locatins_predictins', ['PredictionPlanetId']);
    yield queryInterface.addIndex('planet_locatins_predictins', ['lagnaya']);
    yield queryInterface.addIndex('planet_locatins_predictins', ['planetlocation']);
    console.log('✅ Planet locatins predictins table created successfully!');
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        provider: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: false
        },
        providerId: {
            type: sequelize_2.DataTypes.STRING(200),
            allowNull: false
        },
        metadata: {
            type: sequelize_2.DataTypes.JSON,
            allowNull: true
        },
    });
    yield queryInterface.addIndex('oauth_accounts', ['provider', 'providerId'], { unique: true });
    yield queryInterface.addIndex('oauth_accounts', ['userId']);
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: sequelize_2.DataTypes.STRING(250),
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        lagnaya: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: false
        },
        box1: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box2: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box3: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box4: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box5: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box6: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box7: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box8: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box9: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box10: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box11: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box12: {
            type: sequelize_2.DataTypes.STRING(50),
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        dashawa: {
            type: sequelize_2.DataTypes.STRING(150),
            allowNull: false
        },
        From: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: false
        },
        To: {
            type: sequelize_2.DataTypes.DATEONLY,
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
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        anthardhashawa: {
            type: sequelize_2.DataTypes.STRING(200),
            allowNull: false
        },
        setNo: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false
        },
        From: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: false
        },
        To: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: false
        }
    });
    yield queryInterface.addIndex('anthar_dasha', ['userId']);
    yield queryInterface.addIndex('anthar_dasha', ['setNo']);
    console.log('✅ Anthar dasha table created successfully!');
});
const createPredictionPlanetTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating prediction_planet table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_planet')) {
        console.log('⚠️  Prediction planet table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_planet', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PlanetName: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    });
    console.log('✅ Prediction planet table created successfully!');
});
const createPredictionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating predictions table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('predictions')) {
        console.log('⚠️  Predictions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('predictions', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        PredictionPlanetId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_planet',
                key: 'id'
            },
        },
        general_prediction: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false
        },
        personalised_prediction: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false
        },
        planet_zodiac_prediction: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false
        },
        verbal_location: {
            type: sequelize_2.DataTypes.STRING(200),
            allowNull: false
        }
    });
    try {
        yield queryInterface.addIndex('predictions', ['PredictionPlanetId']);
    }
    catch (error) {
        if (error.name === 'SequelizeDatabaseError' && (error.original.code === 'ER_DUP_KEYNAME' || error.original.code === '42P07')) {
            console.log('⚠️  Index on predictionPlanetId already exists, skipping...');
        }
        else {
            throw error;
        }
    }
    try {
        yield queryInterface.addIndex('predictions', ['userId']);
    }
    catch (error) {
        if (error.name === 'SequelizeDatabaseError' && (error.original.code === 'ER_DUP_KEYNAME' || error.original.code === '42P07')) {
            console.log('⚠️  Index on userId already exists, skipping...');
        }
        else {
            throw error;
        }
    }
    console.log('✅ Predictions table created successfully!');
});
const createJobsCategoryTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating jobs_category table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('jobs_category')) {
        console.log('⚠️  Jobs category table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('jobs_category', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CategoryName: {
            type: sequelize_2.DataTypes.STRING(300),
            allowNull: false
        }
    });
    console.log('✅ Jobs category table created successfully!');
});
const createJobsItemTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating jobs_item table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('jobs_item')) {
        console.log('⚠️  Jobs item table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('jobs_item', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        JobCategoryId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobs_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        JobsName: {
            type: sequelize_2.DataTypes.STRING(300),
            allowNull: false
        }
    });
    yield queryInterface.addIndex('jobs_item', ['JobCategoryId']);
    console.log('✅ Jobs item table created successfully!');
});
const createJobsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating jobs table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('jobs')) {
        console.log('⚠️  Jobs table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('jobs', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        JobItemId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobs_item',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        }
    });
    yield queryInterface.addIndex('jobs', ['userId']);
    yield queryInterface.addIndex('jobs', ['JobItemId']);
    console.log('✅ Jobs table created successfully!');
});
const createEducationQualificationsCategoryTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating education_qualifications_category table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('education_qualifications_category')) {
        console.log('⚠️  Education qualifications category table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('education_qualifications_category', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        CategoryName: {
            type: sequelize_2.DataTypes.STRING(300),
            allowNull: false
        }
    });
    console.log('✅ Education qualifications category table created successfully!');
});
const createEducationQualificationsItemTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating education_qualifications_item table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('education_qualifications_item')) {
        console.log('⚠️  Education qualifications item table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('education_qualifications_item', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        EducationqualificationsCategoryId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'education_qualifications_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        qualificationsName: {
            type: sequelize_2.DataTypes.STRING(300),
            allowNull: false
        }
    });
    yield queryInterface.addIndex('education_qualifications_item', ['EducationqualificationsCategoryId']);
    console.log('✅ Education qualifications item table created successfully!');
});
const createEducationQualificationsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating education_qualifications table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('education_qualifications')) {
        console.log('⚠️  Education qualifications table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('education_qualifications', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        EducationqualificationsItemId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'education_qualifications_item',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        }
    });
    yield queryInterface.addIndex('education_qualifications', ['userId']);
    yield queryInterface.addIndex('education_qualifications', ['EducationqualificationsItemId']);
    console.log('✅ Education qualifications table created successfully!');
});
const seedDefaultData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding default data...');
    try {
        const [genderResults] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM gender');
        if (genderResults[0].count === '0') {
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
        if (birthLocationResults[0].count === '0') {
            yield queryInterface.bulkInsert('birth_locations', [
                { name: 'Not Set Birth Location', longitude: null, latitude: null }
            ]);
            console.log('✅ Default birth location seeded successfully');
        }
        else {
            console.log('⚠️  Birth location data already exists, skipping seed...');
        }
        yield seedJobsData(queryInterface);
        yield seedEducationQualificationsData(queryInterface);
        console.log('✅ All default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
});
const createProfileImageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating profile_image table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('profile_image')) {
        console.log('⚠️  Profile image table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('profile_image', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        imagePath: {
            type: sequelize_2.DataTypes.STRING(255),
            allowNull: false
        }
    });
    yield queryInterface.addIndex('profile_image', ['userId']);
    console.log('✅ Profile image table created successfully!');
});
const createNavamsakaTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating navamsaka table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('navamsaka')) {
        console.log('⚠️  Navamsaka table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('navamsaka', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        lagnaya: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: false
        },
        box1: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box2: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box3: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box4: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box5: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box6: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box7: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box8: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box9: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box10: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box11: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        },
        box12: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true
        }
    });
    yield queryInterface.addIndex('navamsaka', ['userId']);
    console.log('✅ Navamsaka table created successfully!');
});
const seedJobsData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding jobs data...');
    const jobsJson = {
        "jobs": {
            "IT & Software": [
                "Software Engineer",
                "Full Stack Developer",
                "Mobile App Developer (Android / iOS)",
                "Cloud Engineer",
                "DevOps Engineer",
                "Data Scientist",
                "Machine Learning Engineer",
                "Cybersecurity Analyst",
                "UI/UX Designer",
                "QA Engineer / Automation Tester",
                "IT Project Manager",
                "Network Administrator"
            ],
            "Engineering": [
                "Civil Engineer",
                "Mechanical Engineer",
                "Electrical Engineer",
                "Electronic / Telecommunication Engineer",
                "Quantity Surveyor",
                "Structural Engineer",
                "Project Engineer",
                "Mechatronics Engineer",
                "Environmental Engineer"
            ],
            "Medical & Healthcare": [
                "Medical Officer",
                "Specialist Doctor",
                "Nursing Officer",
                "Pharmacist",
                "Laboratory Technician",
                "Radiographer",
                "Physiotherapist",
                "Public Health Inspector (PHI)",
                "Medical Research Officer"
            ],
            "Business, Finance & Administration": [
                "Accountant",
                "Auditor",
                "Financial Analyst",
                "Business Analyst",
                "HR Manager",
                "Admin Executive",
                "Operations Manager",
                "Marketing Manager",
                "Customer Relationship Manager (CRM)",
                "Procurement Officer"
            ],
            "Education": [
                "School Teacher",
                "University Lecturer",
                "Tutor",
                "Special Needs Teacher",
                "Principal",
                "Education Consultant"
            ],
            "Government & Public Sector": [
                "Administrative Service Officer (SLAS)",
                "Engineering Service Officer (SLEngS)",
                "Education Service Officer",
                "Police Officer",
                "Tri-Forces Officer",
                "Development Officer",
                "Public Management Officer"
            ],
            "Banking & Finance": [
                "Bank Manager",
                "Banking Assistant",
                "Credit Officer",
                "Loan Executive",
                "Risk Analyst",
                "Investment Advisor",
                "Insurance Advisor",
                "Branch Operations Manager"
            ],
            "Logistics & Supply Chain": [
                "Logistics Manager",
                "Supply Chain Executive",
                "Warehouse Manager",
                "Transport Manager",
                "Customs Officer",
                "Shipping Executive",
                "Freight Forwarder"
            ],
            "Legal & Law Enforcement": [
                "Attorney-at-Law",
                "Notary Public",
                "Legal Executive",
                "Judicial Officer",
                "Compliance Officer"
            ],
            "Hospitality & Tourism": [
                "Hotel Manager",
                "Chef",
                "Tour Guide",
                "Travel Consultant",
                "Guest Relations Officer",
                "Front Office Executive"
            ],
            "Media & Creative": [
                "Graphic Designer",
                "Video Editor",
                "Photographer",
                "Content Creator",
                "Social Media Manager",
                "Journalist",
                "TV/Radio Presenter",
                "Animator"
            ],
            "Agriculture & Environment": [
                "Agricultural Officer",
                "Agronomist",
                "Environmental Scientist",
                "Food Technologist",
                "Plantation Manager"
            ],
            "Construction & Technical": [
                "Architect",
                "Draftsman",
                "Site Supervisor",
                "Safety Officer (HSE)",
                "Electrician",
                "Plumber",
                "Welder",
                "Heavy Vehicle Operator"
            ],
            "Sales & Customer Support": [
                "Sales Executive",
                "Business Development Manager",
                "Customer Support Officer",
                "Call Center Agent",
                "Retail Manager"
            ],
            "Airline, Marine & Transport": [
                "Pilot",
                "Aircraft Maintenance Engineer",
                "Flight Attendant",
                "Marine Engineer",
                "Ship Captain",
                "Driver (Light/Heavy)",
                "Train Driver"
            ]
        }
    };
    const [jobsCatCount] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM jobs_category');
    if (jobsCatCount[0].count > 0) {
        console.log('⚠️  Jobs data already exists, skipping seed...');
        return;
    }
    for (const catName of Object.keys(jobsJson.jobs)) {
        yield queryInterface.bulkInsert('jobs_category', [{ CategoryName: catName }]);
        const [[{ id }]] = yield sequelize_1.sequelize.query(`SELECT id FROM jobs_category WHERE "CategoryName" = ? LIMIT 1`, { replacements: [catName] });
        const items = jobsJson.jobs[catName].map((name) => ({ JobCategoryId: id, JobsName: name }));
        yield queryInterface.bulkInsert('jobs_item', items);
    }
    console.log('✅ Jobs data seeded successfully');
});
const createAstrologicalDetailsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating astrological_details table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('astrological_details')) {
        console.log('⚠️  Astrological details table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('astrological_details', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        gana: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        yoni: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        vasya: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        nadi: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        varna: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        paya: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        paya_by_nakshatra: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        tatva: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        life_stone: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        lucky_stone: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        fortune_stone: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        name_start: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        ascendant_sign: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        ascendant_nakshatra: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        rasi: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        rasi_lord: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra_lord: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra_pada: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false
        },
        sun_sign: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        tithi: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        karana: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        yoga: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        ayanamsa: {
            type: sequelize_2.DataTypes.DOUBLE,
            allowNull: false
        }
    });
    yield queryInterface.addIndex('astrological_details', ['userId']);
    console.log('✅ Astrological details table created successfully!');
});
function seedPredictionPlanetsData(queryInterface) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('📝 Seeding prediction planets data...');
        const [results] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM prediction_planet');
        if (results[0].count === '0') {
            const planets = [
                { PlanetName: "Sun" },
                { PlanetName: "Moon" },
                { PlanetName: "Mars" },
                { PlanetName: "Mercury" },
                { PlanetName: "Jupiter" },
                { PlanetName: "Venus" },
                { PlanetName: "Saturn" },
                { PlanetName: "Rahu" },
                { PlanetName: "Ketu" }
            ];
            yield queryInterface.bulkInsert('prediction_planet', planets);
            console.log('✅ Prediction planets seeded successfully');
        }
        else {
            console.log('⚠️  Prediction planets data already exists');
        }
    });
}
const seedEducationQualificationsData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding education qualifications data...');
    const educationJson = {
        "education_qualifications_sri_lanka": {
            "school_level": {
                "general_education": [
                    "Preschool / Early Childhood Education",
                    "Grade 1–11 (Compulsory Education)",
                    "GCE Ordinary Level (O/L)",
                    "GCE Advanced Level (A/L)"
                ],
                "a_l_streams": [
                    "Arts",
                    "Commerce",
                    "Science",
                    "Technology",
                    "Engineering Technology",
                    "Bio System Technology",
                    "Information & Communication Technology (ICT)"
                ]
            },
            "vocational_and_technical": {
                "nvq_levels": {
                    "NVQ Level 1": "Assistant Level",
                    "NVQ Level 2": "Semi-skilled Worker",
                    "NVQ Level 3": "Skilled Worker",
                    "NVQ Level 4": "Craftsman / Technician",
                    "NVQ Level 5": "Diploma Level",
                    "NVQ Level 6": "Higher National Diploma (HND equivalent)",
                    "NVQ Level 7": "Bachelor's Degree (Technology / Applied)"
                },
                "other_technical_qualifications": [
                    "Certificate (Level 3 / 4)",
                    "National Certificate (NC)",
                    "National Vocational Certificate (NVC)",
                    "National Diploma (ND)",
                    "National Apprenticeship Qualification (NAITA)",
                    "Higher National Diploma (HNDE, HNDIT, HNDM, HNDA)"
                ]
            },
            "university_and_higher_education": {
                "undergraduate": [
                    "Certificate Course (University)",
                    "Diploma",
                    "Higher National Diploma (HND)",
                    "Bachelor of Arts (BA)",
                    "Bachelor of Science (BSc)",
                    "Bachelor of Engineering (BSc Eng)",
                    "Bachelor of Commerce (BCom)",
                    "Bachelor of Laws (LLB)",
                    "Bachelor of Business Administration (BBA)",
                    "Bachelor of Medicine & Surgery (MBBS)",
                    "Bachelor of ICT (BICT)",
                    "Bachelor of Information Technology (BIT)",
                    "Bachelor of Education (BEd)",
                    "Bachelor Honours Degree (4-year specialization)"
                ],
                "postgraduate": [
                    "Postgraduate Certificate (PG Cert)",
                    "Postgraduate Diploma (PG Dip)",
                    "Master of Arts (MA)",
                    "Master of Science (MSc)",
                    "Master of Business Administration (MBA)",
                    "Master of Engineering (MEng)",
                    "Master of Education (MEd)",
                    "Master of Public Health (MPH)",
                    "Master of Philosophy (MPhil)",
                    "Doctor of Philosophy (PhD / Doctorate)"
                ]
            },
            "professional_qualifications": {
                "accounting_and_finance": [
                    "CA Sri Lanka (Chartered Accountant)",
                    "CIMA",
                    "ACCA",
                    "CMA Sri Lanka"
                ],
                "it_and_software": [
                    "SLIIT Professional Courses",
                    "CISCO CCNA / CCNP",
                    "Microsoft Certifications",
                    "AWS Certifications",
                    "Oracle Certified",
                    "RedHat (RHCE)"
                ],
                "engineering_and_technical": [
                    "Engineering Council Sri Lanka Registration",
                    "IESL Chartered Engineer",
                    "NDT / NAITA",
                    "AMIE (India)"
                ],
                "management_and_hr": [
                    "SLIM",
                    "CIM",
                    "CIPM (PQHRM)"
                ],
                "education": [
                    "Diploma in Teaching",
                    "Teacher Training College Certifications",
                    "NIE Postgraduate Programs"
                ],
                "health": [
                    "Nursing Diploma",
                    "SLMC Recognized Medical Degrees",
                    "Pharmacy Certificate",
                    "Medical Laboratory Technician (MLT)"
                ]
            },
            "other_recognized_qualifications": {
                "language_certifications": [
                    "IELTS",
                    "TOEFL",
                    "JLPT (Japanese)",
                    "TOPIK (Korean)"
                ],
                "teaching": [
                    "TESOL",
                    "TEFL"
                ],
                "maritime_training": [
                    "IMO Certifications",
                    "Merchant Navy Courses"
                ],
                "aviation_training": [
                    "CAA Sri Lanka Approved Airline Courses"
                ]
            }
        }
    };
    const [eduCatCount] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM education_qualifications_category');
    if (eduCatCount[0].count > 0) {
        console.log('⚠️  Education qualifications data already exists, skipping seed...');
        return;
    }
    const root = educationJson.education_qualifications_sri_lanka;
    for (const topCategory of Object.keys(root)) {
        const subs = root[topCategory];
        for (const subCategory of Object.keys(subs)) {
            const catName = `${topCategory} - ${subCategory}`;
            yield queryInterface.bulkInsert('education_qualifications_category', [{ CategoryName: catName }]);
            const [[{ id }]] = yield sequelize_1.sequelize.query(`SELECT id FROM education_qualifications_category WHERE "CategoryName" = ? LIMIT 1`, { replacements: [catName] });
            let items = [];
            const value = subs[subCategory];
            if (Array.isArray(value)) {
                items = value;
            }
            else if (typeof value === 'object' && value !== null) {
                items = Object.keys(value).map(key => `${key} - ${value[key]}`);
            }
            const itemRecords = items.map(name => ({ EducationqualificationsCategoryId: id, qualificationsName: name }));
            if (itemRecords.length > 0) {
                yield queryInterface.bulkInsert('education_qualifications_item', itemRecords);
            }
        }
    }
    console.log('✅ Education qualifications data seeded successfully');
});
const createSubscriptionPackagesTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating subscription_packages table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('subscription_packages')) {
        console.log('⚠️  Subscription packages table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('subscription_packages', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: true,
        },
        monthly_price: {
            type: sequelize_2.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        yearly_price: {
            type: sequelize_2.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        features: {
            type: sequelize_2.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
    });
    console.log('✅ Subscription packages table created successfully!');
});
const createUserSubscriptionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_subscriptions table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_subscriptions')) {
        console.log('⚠️  User subscriptions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_subscriptions', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        packageId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'subscription_packages', key: 'id' },
        },
        duration: {
            type: sequelize_2.DataTypes.ENUM('monthly', 'yearly'),
            allowNull: true,
        },
        startDate: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
        endDate: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_2.DataTypes.ENUM('active', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'active',
        },
        paymentId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'payments', key: 'id' },
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
    });
    console.log('✅ User subscriptions table created successfully!');
});
const createPaymentsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating payments table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('payments')) {
        console.log('⚠️  Payments table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('payments', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        amount: {
            type: sequelize_2.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_2.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'LKR',
        },
        gateway: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: false,
        },
        orderId: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        transactionId: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: true,
        },
        status: {
            type: sequelize_2.DataTypes.ENUM('pending', 'success', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        responseData: {
            type: sequelize_2.DataTypes.JSONB,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            defaultValue: sequelize_2.DataTypes.NOW,
        },
    });
    console.log('✅ Payments table created successfully!');
});
const createPredictionCategoryTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔧 Creating prediction_category table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_category')) {
        console.log('⚠️  Prediction category table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_category', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false,
        }
    });
    console.log('✅ Prediction category table created successfully!');
});
const createPredictionItemsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔧 Creating prediction_items table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_items')) {
        console.log('⚠️  Prediction items table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_items', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        predcitonCatId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        PredictionPlanetId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_planet',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        itemName: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false,
        },
        feedback: {
            type: sequelize_2.DataTypes.STRING(1),
            allowNull: false,
        }
    });
    yield queryInterface.addIndex('prediction_items', ['predcitonCatId']);
    yield queryInterface.addIndex('prediction_items', ['PredictionPlanetId']);
    console.log('✅ Prediction items table created successfully!');
});
const createUserFeedbackTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔧 Creating user_feedback table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_feedback')) {
        console.log('⚠️  User feedback table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_feedback', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PredictionItemId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_items',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    });
    yield queryInterface.addIndex('user_feedback', ['PredictionItemId']);
    yield queryInterface.addIndex('user_feedback', ['userId']);
    console.log('✅ User feedback table created successfully!');
});
const seedPredictionCategories = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔧 Seeding prediction categories...');
    const [results] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM prediction_category');
    if (results[0].count !== '0') {
        console.log('⚠️  Prediction categories already exist, skipping seed...');
        return;
    }
    const categories = [
        { name: 'General Prediction' },
        { name: 'Personalised Prediction' },
        { name: 'Planet Zodiac Prediction' },
        { name: 'Verbal Location' }
    ];
    yield queryInterface.bulkInsert('prediction_category', categories);
    console.log('✅ Prediction categories seeded successfully!');
});
const seedSubscriptionPackages = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield queryInterface.sequelize.query('SELECT COUNT(*) FROM subscription_packages');
    if (parseInt(count[0][0].count) > 0) {
        console.log('⚠️  Subscription packages already seeded, skipping...');
        return;
    }
    yield queryInterface.bulkInsert('subscription_packages', [
        {
            name: 'Silver',
            description: 'Basic free package',
            monthly_price: 0.00,
            yearly_price: 0.00,
            features: JSON.stringify(['Basic features', 'Limited access']),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Gold',
            description: 'Premium package with more features',
            monthly_price: 500.00,
            yearly_price: 5000.00,
            features: JSON.stringify(['All Silver features', 'Advanced predictions', 'Unlimited profiles']),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Platinum',
            description: 'Ultimate package',
            monthly_price: 1000.00,
            yearly_price: 10000.00,
            features: JSON.stringify(['All Gold features', 'Personal consultations', 'Priority support']),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]);
    console.log('✅ Subscription packages seeded successfully!');
});
const createUserFeedbackQuestionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_feedback_questions table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_feedback_questions')) {
        console.log('⚠️  User feedback questions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_feedback_questions', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question_key: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        question_text_si: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: false
        },
        question_text_en: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: true
        },
        question_type: {
            type: sequelize_2.DataTypes.ENUM('yes_no', 'text', 'number', 'date', 'year', 'select', 'color', 'multi_select'),
            allowNull: false
        },
        options: {
            type: sequelize_2.DataTypes.JSONB,
            allowNull: true,
            comment: 'For select/multi_select types'
        },
        parent_question_key: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Key of parent question for conditional display'
        },
        parent_answer_condition: {
            type: sequelize_2.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Required answer from parent to show this question'
        },
        display_order: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        category: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: true
        },
        is_active: {
            type: sequelize_2.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('user_feedback_questions', ['question_key']);
    yield queryInterface.addIndex('user_feedback_questions', ['parent_question_key']);
    yield queryInterface.addIndex('user_feedback_questions', ['category']);
    console.log('✅ User feedback questions table created successfully!');
});
const createUserFeedbackAnswersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_feedback_answers table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_feedback_answers')) {
        console.log('⚠️  User feedback answers table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_feedback_answers', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        question_key: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false
        },
        answer_text: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: true
        },
        answer_number: {
            type: sequelize_2.DataTypes.DOUBLE,
            allowNull: true
        },
        answer_date: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: true
        },
        answer_json: {
            type: sequelize_2.DataTypes.JSONB,
            allowNull: true,
            comment: 'For multi-select or complex answers'
        },
        created_at: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('user_feedback_answers', ['user_id']);
    yield queryInterface.addIndex('user_feedback_answers', ['question_key']);
    yield queryInterface.addIndex('user_feedback_answers', ['user_id', 'question_key'], {
        unique: true,
        name: 'user_question_unique'
    });
    const dialect = sequelize_1.sequelize.getDialect();
    console.log('✅ User feedback answers table created successfully!');
});
const createDeceasedFamilyMembersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating deceased_family_members table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('deceased_family_members')) {
        console.log('⚠️  Deceased family members table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('deceased_family_members', {
        id: {
            type: sequelize_2.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        relationship: {
            type: sequelize_2.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Relationship to user (e.g., father, mother, sibling)'
        },
        date_of_birth: {
            type: sequelize_2.DataTypes.DATEONLY,
            allowNull: true
        },
        birth_time: {
            type: sequelize_2.DataTypes.TIME,
            allowNull: true
        },
        birth_location_id: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'birth_locations',
                key: 'id'
            }
        },
        year_of_death: {
            type: sequelize_2.DataTypes.INTEGER,
            allowNull: true
        },
        cause_of_death: {
            type: sequelize_2.DataTypes.TEXT,
            allowNull: true
        },
        createdAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: sequelize_2.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('deceased_family_members', ['userId']);
    console.log('✅ Deceased family members table created successfully!');
});
const seedFeedbackQuestions = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding feedback questions...');
    const [results] = yield sequelize_1.sequelize.query('SELECT COUNT(*) as count FROM user_feedback_questions');
    if (results[0].count > 0) {
        console.log('⚠️  Feedback questions already exist, skipping seed...');
        return;
    }
    const questions = [
        {
            question_key: 'marital_status',
            question_text_si: 'විවාහක / අවිවාහක',
            question_text_en: 'Marital Status',
            question_type: 'select',
            options: JSON.stringify(['විවාහක', 'අවිවාහක']),
            display_order: 1,
            category: 'personal'
        },
        {
            question_key: 'marriage_year',
            question_text_si: 'විවාහ වූ අවුරුද්ද',
            question_text_en: 'Year of Marriage',
            question_type: 'year',
            parent_question_key: 'marital_status',
            parent_answer_condition: 'විවාහක',
            display_order: 2,
            category: 'personal'
        },
        {
            question_key: 'owns_house',
            question_text_si: 'ඔබටම නිවසක් තිබේද ?',
            question_text_en: 'Do you own a house?',
            question_type: 'yes_no',
            display_order: 3,
            category: 'property'
        },
        {
            question_key: 'house_year',
            question_text_si: 'නිවසේ පදිංචි වූ වර්ෂය',
            question_text_en: 'Year moved into house',
            question_type: 'year',
            parent_question_key: 'owns_house',
            parent_answer_condition: 'yes',
            display_order: 4,
            category: 'property'
        },
        {
            question_key: 'owns_vehicle',
            question_text_si: 'ඔබගේ පවුලට ආරක්ෂිත වාහනයක් තිබේද ?',
            question_text_en: 'Does your family own a vehicle?',
            question_type: 'yes_no',
            display_order: 5,
            category: 'property'
        },
        {
            question_key: 'vehicle_year',
            question_text_si: 'වාහනය මිලදී ගත් වර්ෂය',
            question_text_en: 'Year vehicle was purchased',
            question_type: 'year',
            parent_question_key: 'owns_vehicle',
            parent_answer_condition: 'yes',
            display_order: 6,
            category: 'property'
        },
        {
            question_key: 'has_children',
            question_text_si: 'ඔබට දරුවන් සිටීද ?',
            question_text_en: 'Do you have children?',
            question_type: 'yes_no',
            display_order: 7,
            category: 'family'
        },
        {
            question_key: 'daughters_count',
            question_text_si: 'දුවලා කීයද ?',
            question_text_en: 'Number of daughters',
            question_type: 'number',
            parent_question_key: 'has_children',
            parent_answer_condition: 'yes',
            display_order: 8,
            category: 'family'
        },
        {
            question_key: 'sons_count',
            question_text_si: 'පුතාලා කීයද ?',
            question_text_en: 'Number of sons',
            question_type: 'number',
            parent_question_key: 'has_children',
            parent_answer_condition: 'yes',
            display_order: 9,
            category: 'family'
        },
        {
            question_key: 'first_child_age',
            question_text_si: 'පළමු දරුවාගේ වයස',
            question_text_en: 'Age of first child',
            question_type: 'number',
            parent_question_key: 'has_children',
            parent_answer_condition: 'yes',
            display_order: 10,
            category: 'family'
        },
        {
            question_key: 'spouse_birth_year',
            question_text_si: 'ඔබගේ සැමියාගේ හෝ බිරිදගේ උපන් වර්ෂය',
            question_text_en: 'Spouse birth year',
            question_type: 'year',
            parent_question_key: 'marital_status',
            parent_answer_condition: 'විවාහක',
            display_order: 11,
            category: 'family'
        },
        {
            question_key: 'skin_color',
            question_text_si: 'ඔබේ සමේ පැහැය',
            question_text_en: 'Skin color',
            question_type: 'select',
            options: JSON.stringify(['සුදු', 'තලඑලලු', 'කලු']),
            display_order: 12,
            category: 'physical'
        },
        {
            question_key: 'height',
            question_text_si: 'ඔබගේ උස',
            question_text_en: 'Height',
            question_type: 'select',
            options: JSON.stringify(['වැඩි', 'මධ්‍යම', 'මිටි']),
            display_order: 13,
            category: 'physical'
        },
        {
            question_key: 'body_type',
            question_text_si: 'ඔබගේ දේහ',
            question_text_en: 'Body type',
            question_type: 'select',
            options: JSON.stringify(['සිහින්', 'මහත', 'සාමාන්‍ය']),
            display_order: 14,
            category: 'physical'
        },
        {
            question_key: 'travelled_abroad',
            question_text_si: 'ඔබ විදෙස් ගත වී තිබේද ?',
            question_text_en: 'Have you travelled abroad?',
            question_type: 'yes_no',
            display_order: 15,
            category: 'travel'
        },
        {
            question_key: 'travel_year',
            question_text_si: 'විදෙස් ගත වූ වර්ෂය',
            question_text_en: 'Year of travel',
            question_type: 'year',
            parent_question_key: 'travelled_abroad',
            parent_answer_condition: 'yes',
            display_order: 16,
            category: 'travel'
        },
        {
            question_key: 'travel_country',
            question_text_si: 'විදෙස් ගත වූ රට',
            question_text_en: 'Country visited',
            question_type: 'text',
            parent_question_key: 'travelled_abroad',
            parent_answer_condition: 'yes',
            display_order: 17,
            category: 'travel'
        },
        {
            question_key: 'has_advanced_level',
            question_text_si: 'ඔබ උසස්පෙල අධ්‍යාපනය ලැබුවේද ?',
            question_text_en: 'Did you complete Advanced Level?',
            question_type: 'yes_no',
            display_order: 18,
            category: 'education'
        },
        {
            question_key: 'al_stream',
            question_text_si: 'උසස්පෙල ප්‍රධාන අංශය',
            question_text_en: 'A/L Stream',
            question_type: 'select',
            options: JSON.stringify(['කලා', 'වානිජ', 'තාක්ෂණ', 'විද්‍යා', 'ගණිත']),
            parent_question_key: 'has_advanced_level',
            parent_answer_condition: 'yes',
            display_order: 19,
            category: 'education'
        },
        {
            question_key: 'artistic_interest',
            question_text_si: 'ඔබ වඩාත් කැමති සෞන්දර්ය අංශය',
            question_text_en: 'Artistic interest',
            question_type: 'multi_select',
            options: JSON.stringify(['චිත්‍ර ඇදීම', 'සංගීත වාදනය', 'ගායනය', 'නර්තනය', 'රංගනය']),
            display_order: 20,
            category: 'interests'
        },
        {
            question_key: 'favorite_color',
            question_text_si: 'ඔබගේ ප්‍රියතම වර්ණය',
            question_text_en: 'Favorite color',
            question_type: 'color',
            display_order: 21,
            category: 'interests'
        },
        {
            question_key: 'favorite_pet',
            question_text_si: 'ඔබ කැමතිම සුරතලා',
            question_text_en: 'Favorite pet',
            question_type: 'select',
            options: JSON.stringify(['බල්ලා', 'පූසා', 'විසිතුරු මසුන්', 'වෙනත්']),
            display_order: 22,
            category: 'interests'
        },
        {
            question_key: 'current_illnesses',
            question_text_si: 'ඔබට දැනට ඇති රෝගාබාධ',
            question_text_en: 'Current illnesses',
            question_type: 'text',
            display_order: 23,
            category: 'health'
        },
        {
            question_key: 'plays_sports',
            question_text_si: 'ඔබ දැනට ක්‍රීඩාවක් සිදු කරනවාද ?',
            question_text_en: 'Do you play sports?',
            question_type: 'yes_no',
            display_order: 24,
            category: 'sports'
        },
        {
            question_key: 'sport_name',
            question_text_si: 'ක්‍රීඩාවේ නම',
            question_text_en: 'Sport name',
            question_type: 'text',
            parent_question_key: 'plays_sports',
            parent_answer_condition: 'yes',
            display_order: 25,
            category: 'sports'
        },
        {
            question_key: 'has_deceased_family',
            question_text_si: 'ඔබගේ පවුලේ සමාජිකයෙක් මිය ගිය ඇත්ද ?',
            question_text_en: 'Has a family member passed away?',
            question_type: 'yes_no',
            display_order: 26,
            category: 'family_deceased'
        }
    ];
    yield queryInterface.bulkInsert('user_feedback_questions', questions);
    console.log('✅ Feedback questions seeded successfully!');
});
