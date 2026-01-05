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
exports.runPredictionMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createLifeTimePredictionCategoryTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating Life Time Prediction Category table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('life_time_prediction_category')) {
        console.log('⚠️ Life Time Prediction Category  table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable("life_time_prediction_category", {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false
        }
    });
    console.log('✅ Life Time Prediction Category table created successfully!');
});
const createLifeTimePredictionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating life_time_predictions Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('life_time_predictions')) {
        console.log('⚠️ life_time_predictions table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable("life_time_predictions", {
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
        life_time_prediction_category_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'life_time_prediction_category',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        prediction_planet_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_planet',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        predciton: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        }
    });
    yield queryInterface.addIndex('life_time_predictions', ['user_id']);
    yield queryInterface.addIndex('life_time_predictions', ['life_time_prediction_category_id']);
    yield queryInterface.addIndex('life_time_predictions', ['prediction_planet_id']);
    console.log('✅ Life Time Prediction table created successfully!');
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
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        planet_name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        }
    });
    console.log('✅ Prediction planet table created successfully!');
});
const createPredictionTranslateTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating prediction translate table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_translations')) {
        console.log('⚠️ Prediction translations table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_translations', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        language: {
            type: sequelize_1.DataTypes.ENUM('si', 'ta'),
            allowNull: false
        },
        translated_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        original_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        }
    });
    console.log('✅ Prediction translations  table created successfully!');
});
const seedDefaultData = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Seeding Predictions default data...');
    try {
        const [LifeTimePredictionCategoryResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM life_time_prediction_category');
        if (LifeTimePredictionCategoryResults[0].count === '0') {
            yield queryInterface.bulkInsert('life_time_prediction_category', [
                { name: 'General Prediction' },
                { name: 'Personalised Prediction' },
                { name: 'Planet Zodiac Prediction' },
                { name: 'Verbal Location' }
            ]);
            console.log('✅ Default Life TimePrediction Category seeded successfully');
        }
        else {
            console.log('⚠️ LifeTime Prediction Category data already exists, skipping seed...');
        }
        console.log('📝 Seeding prediction planets data...');
        const [results] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM prediction_planet');
        if (results[0].count === '0') {
            const planets = [
                { planet_name: "Sun" },
                { planet_name: "Moon" },
                { planet_name: "Mars" },
                { planet_name: "Mercury" },
                { planet_name: "Jupiter" },
                { planet_name: "Venus" },
                { planet_name: "Saturn" },
                { planet_name: "Rahu" },
                { planet_name: "Ketu" }
            ];
            yield queryInterface.bulkInsert('prediction_planet', planets);
            console.log('✅ Prediction planets seeded successfully');
        }
        else {
            console.log('⚠️  Prediction planets data already exists');
        }
        console.log('✅ All Prediction default data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️  Error seeding data:', error);
    }
});
const createPredictionFeedbacksTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating prediction_feedbacks Table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('prediction_feedbacks')) {
        console.log('⚠️  Prediction feedbacks table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('prediction_feedbacks', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        prediction_planet_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        life_time_prediction_category_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        prediction_text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        feedback_type: {
            type: sequelize_1.DataTypes.ENUM('correct', 'incorrect', 'undecided'),
            allowNull: false,
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
    yield queryInterface.addIndex('prediction_feedbacks', ['user_id'], {
        name: 'idx_feedback_user',
    });
    yield queryInterface.addIndex('prediction_feedbacks', ['prediction_planet_id'], {
        name: 'idx_feedback_planet',
    });
    yield queryInterface.addIndex('prediction_feedbacks', ['life_time_prediction_category_id'], {
        name: 'idx_feedback_category',
    });
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS update_prediction_feedbacks_updated_at ON prediction_feedbacks;
            CREATE TRIGGER update_prediction_feedbacks_updated_at
            BEFORE UPDATE ON prediction_feedbacks
            FOR EACH ROW
            EXECUTE PROCEDURE update_timestamp();
        `);
    }
    console.log('✅ Prediction feedbacks table created successfully!');
});
const createPlanetLocationsPredictionsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating planet_locatins_predictins table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('planet_locatins_predictins')) {
        console.log('⚠️ planet_locatins_predictins table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('planet_locatins_predictins', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lagnaya: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        prediction_planet_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'prediction_planet',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        planet_location: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
        },
        prediction: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        }
    });
    yield queryInterface.addIndex('planet_locatins_predictins', ['prediction_planet_id']);
    yield queryInterface.addIndex('planet_locatins_predictins', ['lagnaya']);
    yield queryInterface.addIndex('planet_locatins_predictins', ['planet_location']);
    console.log('✅ planet_locatins_predictins table created successfully!');
});
const runPredictionMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createLifeTimePredictionCategoryTable(queryInterface);
        yield createPredictionPlanetTable(queryInterface);
        yield createLifeTimePredictionsTable(queryInterface);
        yield createPredictionTranslateTable(queryInterface);
        yield createPredictionFeedbacksTable(queryInterface);
        yield createPlanetLocationsPredictionsTable(queryInterface);
        yield seedDefaultData(queryInterface);
        console.log('🎉 User migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ User migration failed:', error);
        throw error;
    }
});
exports.runPredictionMigrations = runPredictionMigrations;
