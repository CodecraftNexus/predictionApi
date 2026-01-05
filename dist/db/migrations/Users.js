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
exports.runUserMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createGenderTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Gender Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('gender')) {
        console.log('⚠️  Gender table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('gender', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true
        }
    });
    console.log('✅ Gender table created successfully!');
});
const createBirthLocationsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating birth_locations Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('birth_location')) {
        console.log('⚠️  Birth locations table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('birth_location', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        time_zone: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true
        },
        name: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        longitude: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
        },
        latitude: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
        }
    });
    console.log('✅ Birth locations table created successfully!');
});
const createLanguageTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Language Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('language')) {
        console.log('⚠️  Language table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('language', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
    });
    console.log('✅ Language table created successfully!');
});
const createUsersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating users Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('users')) {
        console.log('⚠️  Users table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('users', {
        id: {
            type: sequelize_1.DataTypes.STRING(100),
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING(254),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        gender_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'gender',
                key: 'id'
            },
        },
        birth_location_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'birth_location',
                key: 'id'
            },
        },
        language_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'language',
                key: 'id'
            },
        },
        date_of_birth: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
        birth_time: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: true,
        },
        hash_password: {
            type: sequelize_1.DataTypes.STRING(250),
            allowNull: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        whatsapp_number: {
            type: sequelize_1.DataTypes.STRING(12),
            allowNull: true,
        },
        reference: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        nikname: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('users', ['email']);
    yield queryInterface.addIndex('users', ['username']);
    yield queryInterface.addIndex('users', ['gender_id']);
    yield queryInterface.addIndex('users', ['birth_location_id']);
    yield queryInterface.addIndex('users', ['language_id']);
    const dialect = sequelize_2.sequelize.getDialect();
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
    console.log('📝 Creating refresh_tokens Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('refresh_tokens')) {
        console.log('⚠️  Refresh tokens table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('refresh_tokens', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        token_hash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        revoked: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('refresh_tokens', ['user_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_refresh_tokens_updated_at ON refresh_tokens;
      CREATE TRIGGER update_refresh_tokens_updated_at
      BEFORE UPDATE ON refresh_tokens
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
        },
        provider: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false
        },
        provider_id: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    yield queryInterface.addIndex('oauth_accounts', ['provider', 'provider_id'], { unique: true });
    yield queryInterface.addIndex('oauth_accounts', ['user_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_oauth_accounts_updated_at ON oauth_accounts;
      CREATE TRIGGER update_oauth_accounts_updated_at
      BEFORE UPDATE ON oauth_accounts
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ OAuth accounts table created successfully!');
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false
        },
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        job_category_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobs_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        jobs_name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false,
        },
    });
    yield queryInterface.addIndex('jobs_item', ['job_category_id']);
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        job_item_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'jobs_item',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        }
    });
    yield queryInterface.addIndex('jobs', ['user_id']);
    yield queryInterface.addIndex('jobs', ['job_item_id']);
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false
        },
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        education_qualifications_category_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'education_qualifications_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        qualifications_name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false
        }
    });
    yield queryInterface.addIndex('education_qualifications_item', ['education_qualifications_category_id']);
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        education_qualifications_item_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'education_qualifications_item',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        }
    });
    yield queryInterface.addIndex('education_qualifications', ['user_id']);
    yield queryInterface.addIndex('education_qualifications', ['education_qualifications_item_id']);
    console.log('✅ Education qualifications table created successfully!');
});
const seedDefaultData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding User default data...');
    try {
        const [genderResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM gender');
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
        const [LanguageResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM language');
        if (LanguageResults[0].count === '0') {
            yield queryInterface.bulkInsert('language', [
                { name: 'si' },
                { name: 'en' },
                { name: 'ta' },
            ]);
            console.log('✅ Default language seeded successfully');
        }
        else {
            console.log('⚠️  Language data already exists, skipping seed...');
        }
        const [birthLocationResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM birth_location');
        if (birthLocationResults[0].count === '0') {
            yield queryInterface.bulkInsert('birth_location', [
                { name: 'Not Set Birth Location', longitude: null, latitude: null }
            ]);
            console.log('✅ Default birth location seeded successfully');
        }
        else {
            console.log('⚠️  Birth location data already exists, skipping seed...');
        }
        yield seedJobsData(queryInterface);
        yield seedEducationQualificationsData(queryInterface);
        console.log('✅ All User default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
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
    const [eduCatCount] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM education_qualifications_category');
    if (eduCatCount[0].count > 0) {
        console.log('⚠️  Education qualifications data already exists, skipping seed...');
        return;
    }
    const root = educationJson.education_qualifications_sri_lanka;
    for (const topCategory of Object.keys(root)) {
        const subs = root[topCategory];
        for (const subCategory of Object.keys(subs)) {
            const catName = `${topCategory} - ${subCategory}`;
            yield queryInterface.bulkInsert('education_qualifications_category', [{ category_name: catName }]);
            const [[{ id }]] = yield sequelize_2.sequelize.query(`SELECT id FROM education_qualifications_category WHERE "category_name" = ? LIMIT 1`, { replacements: [catName] });
            let items = [];
            const value = subs[subCategory];
            if (Array.isArray(value)) {
                items = value;
            }
            else if (typeof value === 'object' && value !== null) {
                items = Object.keys(value).map(key => `${key} - ${value[key]}`);
            }
            const itemRecords = items.map(name => ({ education_qualifications_category_id: id, qualifications_name: name }));
            if (itemRecords.length > 0) {
                yield queryInterface.bulkInsert('education_qualifications_item', itemRecords);
            }
        }
    }
    console.log('✅ Education qualifications data seeded successfully');
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
    const [jobsCatCount] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM jobs_category');
    if (jobsCatCount[0].count > 0) {
        console.log('⚠️  Jobs data already exists, skipping seed...');
        return;
    }
    for (const catName of Object.keys(jobsJson.jobs)) {
        yield queryInterface.bulkInsert('jobs_category', [{ category_name: catName }]);
        const [[{ id }]] = yield sequelize_2.sequelize.query(`SELECT id FROM jobs_category WHERE "category_name" = ? LIMIT 1`, { replacements: [catName] });
        const items = jobsJson.jobs[catName].map((name) => ({ job_category_id: id, jobs_name: name }));
        yield queryInterface.bulkInsert('jobs_item', items);
    }
    console.log('✅ Jobs data seeded successfully');
});
const runUserMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createBirthLocationsTable(queryInterface);
        yield createGenderTable(queryInterface);
        yield createLanguageTable(queryInterface);
        yield createUsersTable(queryInterface);
        yield createEducationQualificationsCategoryTable(queryInterface);
        yield createEducationQualificationsItemTable(queryInterface);
        yield createEducationQualificationsTable(queryInterface);
        yield createJobsCategoryTable(queryInterface);
        yield createJobsItemTable(queryInterface);
        yield createJobsTable(queryInterface);
        yield createRefreshTokensTable(queryInterface);
        yield createOAuthAccountsTable(queryInterface);
        yield seedDefaultData(queryInterface);
        console.log('🎉 User migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ User migration failed:', error);
        throw error;
    }
});
exports.runUserMigrations = runUserMigrations;
