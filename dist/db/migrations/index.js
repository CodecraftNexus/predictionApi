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
        yield createPredictionPlanetTable(queryInterface);
        yield createPredictionsTable(queryInterface);
        yield createJobsCategoryTable(queryInterface);
        yield createJobsItemTable(queryInterface);
        yield createJobsTable(queryInterface);
        yield createEducationQualificationsCategoryTable(queryInterface);
        yield createEducationQualificationsItemTable(queryInterface);
        yield createEducationQualificationsTable(queryInterface);
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
const createPredictionPlanetTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating prediction_planet table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_planet')) {
        console.log('⚠️  Prediction planet table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_planet', {
        id: {
            type: "INTEGER",
            primaryKey: true,
            autoIncrement: true,
        },
        PlanetName: {
            type: "VARCHAR(100)",
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
        predictionPlanetId: {
            type: "INTEGER",
            allowNull: false,
            references: {
                model: 'prediction_planet',
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
    try {
        yield queryInterface.addIndex('predictions', ['predictionPlanetId']);
    }
    catch (error) {
        if (error.name === 'SequelizeDatabaseError' && error.original.code === 'ER_DUP_KEYNAME') {
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
        if (error.name === 'SequelizeDatabaseError' && error.original.code === 'ER_DUP_KEYNAME') {
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
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        CategoryName: {
            type: 'VARCHAR(300)',
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
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        JobCategoryId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'jobs_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        JobsName: {
            type: 'VARCHAR(300)',
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
        JobItemId: {
            type: 'INTEGER',
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
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        CategoryName: {
            type: 'VARCHAR(300)',
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
            type: 'INTEGER',
            primaryKey: true,
            autoIncrement: true
        },
        EducationqualificationsCategoryId: {
            type: 'INTEGER',
            allowNull: false,
            references: {
                model: 'education_qualifications_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        qualificationsName: {
            type: 'VARCHAR(300)',
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
        EducationqualificationsItemId: {
            type: 'INTEGER',
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
        yield seedJobsData(queryInterface);
        yield seedEducationQualificationsData(queryInterface);
        console.log('✅ All default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
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
        const [[{ id }]] = yield sequelize_1.sequelize.query(`SELECT id FROM jobs_category WHERE CategoryName = ? LIMIT 1`, { replacements: [catName] });
        const items = jobsJson.jobs[catName].map((name) => ({ JobCategoryId: id, JobsName: name }));
        yield queryInterface.bulkInsert('jobs_item', items);
    }
    console.log('✅ Jobs data seeded successfully');
});
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
            const [[{ id }]] = yield sequelize_1.sequelize.query(`SELECT id FROM education_qualifications_category WHERE CategoryName = ? LIMIT 1`, { replacements: [catName] });
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
