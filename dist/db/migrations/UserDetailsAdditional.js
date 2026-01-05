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
exports.runUserAdditionalMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createUserFeedbackQuestionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_feedback_questions Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_feedback_questions')) {
        console.log('⚠️  User feedback questions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_feedback_questions', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question_key: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        question_text_si: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        question_text_en: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        question_text_ta: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        question_type: {
            type: sequelize_1.DataTypes.ENUM('yes_no', 'text', 'number', 'date', 'year', 'select', 'color', 'multi_select'),
            allowNull: false,
        },
        options: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        parent_question_key: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        parent_answer_condition: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        display_order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        is_active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
    yield queryInterface.addIndex('user_feedback_questions', ['question_key']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_user_feedback_questions_updated_at ON user_feedback_questions;
      CREATE TRIGGER update_user_feedback_questions_updated_at
      BEFORE UPDATE ON user_feedback_questions
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ User feedback questions table created successfully!');
});
const createUserFeedbackAnswersTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_feedback_answers Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_feedback_answers')) {
        console.log('⚠️  User feedback answers table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_feedback_answers', {
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
        question_key: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: {
                model: 'user_feedback_questions',
                key: 'question_key'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        answer_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        answer_number: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: true,
        },
        answer_date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
        answer_json: {
            type: sequelize_1.DataTypes.JSONB,
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
    yield queryInterface.addIndex('user_feedback_answers', ['user_id']);
    yield queryInterface.addIndex('user_feedback_answers', ['question_key']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_user_feedback_answers_updated_at ON user_feedback_answers;
      CREATE TRIGGER update_user_feedback_answers_updated_at
      BEFORE UPDATE ON user_feedback_answers
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ User feedback answers table created successfully!');
});
const createSubscriptionPackagesTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating subscription_packages Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('subscription_packages')) {
        console.log('⚠️  Subscription packages table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('subscription_packages', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        monthly_price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        yearly_price: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        features: {
            type: sequelize_1.DataTypes.JSONB,
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
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_subscription_packages_updated_at ON subscription_packages;
      CREATE TRIGGER update_subscription_packages_updated_at
      BEFORE UPDATE ON subscription_packages
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ Subscription packages table created successfully!');
});
const createDeceasedFamilyMemberTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating deceased_family_members Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('deceased_family_members')) {
        console.log('⚠️  User subscriptions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('deceased_family_members', {
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
        relationship: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        date_of_birth: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        },
        birth_time: {
            type: sequelize_1.DataTypes.TIME,
            allowNull: true,
        },
        birth_location_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        year_of_death: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        cause_of_death: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS deceased_family_members_updated_at ON deceased_family_members;
      CREATE TRIGGER deceased_family_members_updated_at
      BEFORE UPDATE ON user_feedback_questions
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅  deceased_family_members table created successfully!');
});
const createUserSubscriptionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating user_subscriptions Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('user_subscriptions')) {
        console.log('⚠️  User subscriptions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('user_subscriptions', {
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
        package_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subscription_packages',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        duration: {
            type: sequelize_1.DataTypes.ENUM('monthly', 'yearly'),
            allowNull: true,
        },
        start_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
        },
        end_date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'expired', 'cancelled'),
            allowNull: false,
            defaultValue: 'active',
        },
        payment_id: {
            type: sequelize_1.DataTypes.INTEGER,
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
    yield queryInterface.addIndex('user_subscriptions', ['user_id']);
    yield queryInterface.addIndex('user_subscriptions', ['package_id']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
      CREATE TRIGGER update_user_subscriptions_updated_at
      BEFORE UPDATE ON user_subscriptions
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();
    `);
    }
    console.log('✅ User subscriptions table created successfully!');
});
const createAstrologicalDetailsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating astrological_details Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('astrological_details')) {
        console.log('⚠️  Astrological details table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('astrological_details', {
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
        gana: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        yoni: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        vasya: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        nadi: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        varna: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        paya: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        paya_by_nakshatra: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        tatva: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        life_stone: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        lucky_stone: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        fortune_stone: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        name_start: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        ascendant_sign: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        ascendant_nakshatra: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        rasi: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        rasi_lord: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra_lord: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        nakshatra_pada: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        sun_sign: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        tithi: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        karana: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        yoga: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false
        },
        ayanamsa: {
            type: sequelize_1.DataTypes.DOUBLE,
            allowNull: false
        }
    });
    yield queryInterface.addIndex('astrological_details', ['user_id']);
    console.log('✅ Astrological details table created successfully!');
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'LKR',
        },
        gateway: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        order_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        transaction_id: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'success', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        response_data: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    });
    console.log('✅ Payments table created successfully!');
});
const seedFeedbackQuestions = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding feedback questions...');
    const [questionsCount] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM user_feedback_questions');
    if (questionsCount[0].count > 0) {
        console.log('⚠️  Feedback questions data already exists, skipping seed...');
        return;
    }
    const questions = [
        {
            question_key: 'marital_status',
            question_text_si: 'විවාහක / අවිවාහක',
            question_text_en: 'Marital Status',
            question_text_ta: 'திருமண நிலை',
            question_type: 'select',
            options: JSON.stringify({
                si: ['විවාහක', 'අවිවාහක'],
                en: ['Married', 'Unmarried'],
                ta: ['திருமணமானவர்', 'திருமணமாகாதவர்']
            }),
            display_order: 1,
            category: 'personal'
        },
        {
            question_key: 'marriage_year',
            question_text_si: 'විවාහ වූ වර්ෂය',
            question_text_en: 'Year of Marriage',
            question_text_ta: 'திருமண ஆண்டு',
            question_type: 'year',
            parent_question_key: 'marital_status',
            parent_answer_condition: JSON.stringify({
                si: 'විවාහක',
                en: 'Married',
                ta: 'திருமணமானவர்'
            }),
            display_order: 2,
            category: 'personal'
        },
        {
            question_key: 'owns_house',
            question_text_si: 'ඔබටම නිවසක් තිබේද ?',
            question_text_en: 'Do you own a house?',
            question_text_ta: 'உங்களுக்கு சொந்த வீடு உள்ளதா?',
            question_type: 'yes_no',
            display_order: 3,
            category: 'property'
        },
        {
            question_key: 'house_year',
            question_text_si: 'නිවසේ පදිංචි වූ වර්ෂය',
            question_text_en: 'Year moved into house',
            question_text_ta: 'வீட்டில் குடியேறிய ஆண்டு',
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
            question_text_ta: 'உங்கள் குடும்பத்திற்கு வாகனம் உள்ளதா?',
            question_type: 'yes_no',
            display_order: 5,
            category: 'property'
        },
        {
            question_key: 'vehicle_year',
            question_text_si: 'වාහනය මිලදී ගත් වර්ෂය',
            question_text_en: 'Year vehicle was purchased',
            question_text_ta: 'வாகனம் வாங்கிய ஆண்டு',
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
            question_text_ta: 'உங்களுக்கு குழந்தைகள் உள்ளனரா?',
            question_type: 'yes_no',
            display_order: 7,
            category: 'family'
        },
        {
            question_key: 'daughters_count',
            question_text_si: 'දුවලා කීයද ?',
            question_text_en: 'Number of daughters',
            question_text_ta: 'மகள்களின் எண்ணிக்கை',
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
            question_text_ta: 'மகன்களின் எண்ணிக்கை',
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
            question_text_ta: 'முதல் குழந்தையின் வயது',
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
            question_text_ta: 'மனைவி/கணவர் பிறந்த ஆண்டு',
            question_type: 'year',
            parent_question_key: 'marital_status',
            parent_answer_condition: JSON.stringify({
                si: 'විවාහක',
                en: 'Married',
                ta: 'திருமணமானவர்'
            }),
            display_order: 11,
            category: 'family'
        },
        {
            question_key: 'skin_color',
            question_text_si: 'ඔබේ සමේ පැහැය',
            question_text_en: 'Skin color',
            question_text_ta: 'உங்கள் தோல் நிறம்',
            question_type: 'select',
            options: JSON.stringify({
                si: ['සුදු', 'තලඑලලු', 'කලු'],
                en: ['Fair', 'Wheatish', 'Dark'],
                ta: ['வெள்ளை', 'கோதுமை', 'கருப்பு']
            }),
            display_order: 12,
            category: 'physical'
        },
        {
            question_key: 'height',
            question_text_si: 'ඔබගේ උස',
            question_text_en: 'Height',
            question_text_ta: 'உங்கள் உயரம்',
            question_type: 'select',
            options: JSON.stringify({
                si: ['වැඩි', 'මධ්‍යම', 'මිටි'],
                en: ['Tall', 'Average', 'Short'],
                ta: ['உயரமான', 'சராசரி', 'குறுகிய']
            }),
            display_order: 13,
            category: 'physical'
        },
        {
            question_key: 'body_type',
            question_text_si: 'ඔබගේ දේහ',
            question_text_en: 'Body type',
            question_text_ta: 'உங்கள் உடல் வகை',
            question_type: 'select',
            options: JSON.stringify({
                si: ['සිහින්', 'මහත', 'සාමාන්‍ය'],
                en: ['Slim', 'Heavy', 'Average'],
                ta: ['மெல்லிய', 'கனமான', 'சராசரி']
            }),
            display_order: 14,
            category: 'physical'
        },
        {
            question_key: 'travelled_abroad',
            question_text_si: 'ඔබ විදෙස් ගත වී තිබේද ?',
            question_text_en: 'Have you travelled abroad?',
            question_text_ta: 'நீங்கள் வெளிநாடு சென்றுள்ளீர்களா?',
            question_type: 'yes_no',
            display_order: 15,
            category: 'travel'
        },
        {
            question_key: 'travel_year',
            question_text_si: 'විදෙස් ගත වූ වර්ෂය',
            question_text_en: 'Year of travel',
            question_text_ta: 'பயணம் செய்த ஆண்டு',
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
            question_text_ta: 'சென்ற நாடு',
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
            question_text_ta: 'நீங்கள் உயர்தர கல்வியை முடித்துள்ளீர்களா?',
            question_type: 'yes_no',
            display_order: 18,
            category: 'education'
        },
        {
            question_key: 'al_stream',
            question_text_si: 'උසස්පෙල ප්‍රධාන අංශය',
            question_text_en: 'A/L Stream',
            question_text_ta: 'உயர்தர பிரிவு',
            question_type: 'select',
            options: JSON.stringify({
                si: ['කලා', 'වානිජ', 'තාක්ෂණ', 'විද්‍යා', 'ගණිත'],
                en: ['Arts', 'Commerce', 'Technology', 'Science', 'Mathematics'],
                ta: ['கலை', 'வணிகம்', 'தொழில்நுட்பம்', 'அறிவியல்', 'கணிதம்']
            }),
            parent_question_key: 'has_advanced_level',
            parent_answer_condition: 'yes',
            display_order: 19,
            category: 'education'
        },
        {
            question_key: 'artistic_interest',
            question_text_si: 'ඔබ වඩාත් කැමති සෞන්දර්ය අංශය',
            question_text_en: 'Artistic interest',
            question_text_ta: 'உங்கள் கலை ஆர்வம்',
            question_type: 'multi_select',
            options: JSON.stringify({
                si: ['චිත්‍ර ඇදීම', 'සංගීත වාදනය', 'ගායනය', 'නර්තනය', 'රංගනය'],
                en: ['Painting', 'Music', 'Singing', 'Dancing', 'Acting'],
                ta: ['ஓவியம்', 'இசை', 'பாடுதல்', 'நடனம்', 'நடிப்பு']
            }),
            display_order: 20,
            category: 'interests'
        },
        {
            question_key: 'favorite_color',
            question_text_si: 'ඔබගේ ප්‍රියතම වර්ණය',
            question_text_en: 'Favorite color',
            question_text_ta: 'உங்களுக்கு பிடித்த நிறம்',
            question_type: 'color',
            display_order: 21,
            category: 'interests'
        },
        {
            question_key: 'favorite_pet',
            question_text_si: 'ඔබ කැමතිම සුරතලා',
            question_text_en: 'Favorite pet',
            question_text_ta: 'உங்களுக்கு பிடித்த செல்லப்பிராணி',
            question_type: 'select',
            options: JSON.stringify({
                si: ['බල්ලා', 'පූසා', 'විසිතුරු මසුන්', 'වෙනත්'],
                en: ['Dog', 'Cat', 'Fish', 'Other'],
                ta: ['நாய்', 'பூனை', 'மீன்', 'மற்றவை']
            }),
            display_order: 22,
            category: 'interests'
        },
        {
            question_key: 'has_illnesses',
            question_text_si: 'ඔබට දැනට රෝගාබාධ තිබේද ?',
            question_text_en: 'Do you currently have any illnesses?',
            question_text_ta: 'உங்களுக்கு தற்போது ஏதேனும் நோய்கள் உள்ளதா?',
            question_type: 'yes_no',
            display_order: 23,
            category: 'health'
        },
        {
            question_key: 'current_illnesses',
            question_text_si: 'ඔබට දැනට ඇති රෝගාබාධ',
            question_text_en: 'Current illnesses',
            question_text_ta: 'தற்போதைய நோய்கள்',
            question_type: 'text',
            parent_question_key: 'has_illnesses',
            parent_answer_condition: 'yes',
            display_order: 24,
            category: 'health'
        },
        {
            question_key: 'plays_sports',
            question_text_si: 'ඔබ දැනට ක්‍රීඩාවක් සිදු කරනවාද ?',
            question_text_en: 'Do you play sports?',
            question_text_ta: 'நீங்கள் விளையாட்டு விளையாடுகிறீர்களா?',
            question_type: 'yes_no',
            display_order: 25,
            category: 'sports'
        },
        {
            question_key: 'sport_name',
            question_text_si: 'ක්‍රීඩාවේ නම',
            question_text_en: 'Sport name',
            question_text_ta: 'விளையாட்டின் பெயர்',
            question_type: 'text',
            parent_question_key: 'plays_sports',
            parent_answer_condition: 'yes',
            display_order: 26,
            category: 'sports'
        },
        {
            question_key: 'has_deceased_family',
            question_text_si: 'ඔබගේ පවුලේ සමාජිකයෙක් මිය ගිය ඇත්ද ?',
            question_text_en: 'Has a family member passed away?',
            question_text_ta: 'உங்கள் குடும்ப உறுப்பினர் யாராவது இறந்துள்ளாரா?',
            question_type: 'yes_no',
            display_order: 27,
            category: 'family_deceased'
        }
    ];
    yield queryInterface.bulkInsert('user_feedback_questions', questions.map(q => (Object.assign(Object.assign({}, q), { created_at: new Date(), updated_at: new Date() }))));
    console.log('✅ Feedback questions seeded successfully!');
});
const seedSubscriptionPackages = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding subscription packages...');
    const [packagesCount] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM subscription_packages');
    if (packagesCount[0].count > 0) {
        console.log('⚠️  Subscription packages data already exists, skipping seed...');
        return;
    }
    const packages = [
        {
            name: 'Silver',
            description: 'Basic free package',
            monthly_price: 0.00,
            yearly_price: 0.00,
            features: JSON.stringify(['Basic features', 'Limited access']),
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Gold',
            description: 'Premium package with more features',
            monthly_price: 500.00,
            yearly_price: 5000.00,
            features: JSON.stringify(['All Silver features', 'Advanced predictions', 'Unlimited profiles']),
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: 'Platinum',
            description: 'Ultimate package',
            monthly_price: 1000.00,
            yearly_price: 10000.00,
            features: JSON.stringify(['All Gold features', 'Personal consultations', 'Priority support']),
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];
    yield queryInterface.bulkInsert('subscription_packages', packages);
    console.log('✅ Subscription packages seeded successfully!');
});
const runUserAdditionalMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createUserFeedbackQuestionsTable(queryInterface);
        yield createUserFeedbackAnswersTable(queryInterface);
        yield createSubscriptionPackagesTable(queryInterface);
        yield createUserSubscriptionsTable(queryInterface);
        yield createAstrologicalDetailsTable(queryInterface);
        yield createPaymentsTable(queryInterface);
        yield createDeceasedFamilyMemberTable(queryInterface);
        yield seedFeedbackQuestions(queryInterface);
        yield seedSubscriptionPackages(queryInterface);
        console.log('🎉 User Additional migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ User Additional  migration failed:', error);
        throw error;
    }
});
exports.runUserAdditionalMigrations = runUserAdditionalMigrations;
