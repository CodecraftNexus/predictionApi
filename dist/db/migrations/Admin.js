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
exports.runAdminMigrations = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
const createAdminsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating admins table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('admins')) {
        console.log('⚠️  Admins table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('admins', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING(254),
            allowNull: false,
            unique: true
        },
    });
    yield queryInterface.addIndex('admins', ['email']);
    console.log('✅ Admins table created successfully!');
});
const createAdminRefreshTokensTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating admin_refresh_tokens table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('admin_refresh_tokens')) {
        console.log('⚠️  Admin refresh tokens table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('admin_refresh_tokens', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admins',
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
    yield queryInterface.addIndex('admin_refresh_tokens', ['admin_id']);
    yield queryInterface.addIndex('admin_refresh_tokens', ['token_hash']);
    const dialect = sequelize_2.sequelize.getDialect();
    if (dialect === 'postgres') {
        yield queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS update_admin_refresh_tokens_updated_at ON admin_refresh_tokens;
            CREATE TRIGGER update_admin_refresh_tokens_updated_at
            BEFORE UPDATE ON admin_refresh_tokens
            FOR EACH ROW
            EXECUTE PROCEDURE update_timestamp();
        `);
    }
    console.log('✅ Admin refresh tokens table created successfully!');
});
const createAdminOAuthAccountsTable = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Creating admin_oauth_accounts table...');
    const tableExists = yield queryInterface.showAllTables();
    if (tableExists.includes('admin_oauth_accounts')) {
        console.log('⚠️  Admin OAuth accounts table already exists, skipping...');
        return;
    }
    yield queryInterface.createTable('admin_oauth_accounts', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'admins',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP')
        }
    });
    yield queryInterface.addIndex('admin_oauth_accounts', ['provider', 'provider_id'], {
        unique: true
    });
    yield queryInterface.addIndex('admin_oauth_accounts', ['admin_id']);
    console.log('✅ Admin OAuth accounts table created successfully!');
});
const seedDefaultAdmin = (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📝 Checking for default admin...');
    try {
        const [adminResults] = yield sequelize_2.sequelize.query('SELECT COUNT(*) as count FROM admins');
        if (adminResults[0].count === '0') {
            console.log('📝 Creating default admin...');
            yield queryInterface.bulkInsert('admins', [
                {
                    name: 'System Admin',
                    email: 'scaflanka@gmail.com',
                },
                {
                    name: 'Devloper',
                    email: 'akalankadamith2004@gmail.com',
                },
            ]);
            console.log('✅ Default admin created successfully!');
        }
        else {
            console.log('⚠️  Admin already exists, skipping seed...');
        }
    }
    catch (error) {
        console.error('⚠️  Error seeding admin:', error);
    }
});
const runAdminMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryInterface = sequelize_2.sequelize.getQueryInterface();
        yield createAdminsTable(queryInterface);
        yield createAdminRefreshTokensTable(queryInterface);
        yield createAdminOAuthAccountsTable(queryInterface);
        yield seedDefaultAdmin(queryInterface);
        console.log('🎉 Admin migrations completed successfully!');
    }
    catch (error) {
        console.error('❌ Admin migration failed:', error);
        throw error;
    }
});
exports.runAdminMigrations = runAdminMigrations;
