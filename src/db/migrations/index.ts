import { sequelize } from '../sequelize';
import { QueryInterface } from 'sequelize';

export const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    const queryInterface = sequelize.getQueryInterface();

    // Run migrations in order (respecting foreign keys)
    await createGenderTable(queryInterface);
    await createBirthLocationsTable(queryInterface);
    await createUsersTable(queryInterface);
    await createRefreshTokensTable(queryInterface);
    await createOAuthAccountsTable(queryInterface);
    await createApiKeyTable(queryInterface);
    await createPlanetHouseTable(queryInterface);
    await createDashaBalanceTable(queryInterface);
    await createAntharDashaTable(queryInterface);
    await createPredictionSunTable(queryInterface);

    // Seed default data
    await seedDefaultData(queryInterface);

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Migration 1: Create Gender Table
const createGenderTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating gender table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('gender')) {
    console.log('⚠️  Gender table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('gender', {
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
};

// Migration 2: Create Birth Locations Table
const createBirthLocationsTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating birth_locations table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('birth_locations')) {
    console.log('⚠️  Birth locations table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('birth_locations', {
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
};

// Migration 3: Create Users Table
const createUsersTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating users table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('users')) {
    console.log('⚠️  Users table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('users', {
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addIndex('users', ['username']);
  await queryInterface.addIndex('users', ['genderId']);
  await queryInterface.addIndex('users', ['birth_location_id']);

  console.log('✅ Users table created successfully!');
};

// Migration 4: Create Refresh Tokens Table
const createRefreshTokensTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating refresh_tokens table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('refresh_tokens')) {
    console.log('⚠️  Refresh tokens table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('refresh_tokens', {
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('refresh_tokens', ['user_id']);
  await queryInterface.addIndex('refresh_tokens', ['token_hash']);

  console.log('✅ Refresh tokens table created successfully!');
};

// Migration 5: Create OAuth Accounts Table
const createOAuthAccountsTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating oauth_accounts table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('oauth_accounts')) {
    console.log('⚠️  OAuth accounts table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('oauth_accounts', {
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('oauth_accounts', ['provider', 'provider_id'], { unique: true });
  await queryInterface.addIndex('oauth_accounts', ['user_id']);

  console.log('✅ OAuth accounts table created successfully!');
};

// Migration 6: Create API Key Table
const createApiKeyTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating api_key table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('api_key')) {
    console.log('⚠️  API key table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('api_key', {
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
};

// Migration 7: Create Planet House Table
const createPlanetHouseTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating planet_house table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('planet_house')) {
    console.log('⚠️  Planet house table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('planet_house', {
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

  await queryInterface.addIndex('planet_house', ['userId']);

  console.log('✅ Planet house table created successfully!');
};

// Migration 8: Create Dasha Balance Table
const createDashaBalanceTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating dasha_balance table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('dasha_balance')) {
    console.log('⚠️  Dasha balance table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('dasha_balance', {
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

  await queryInterface.addIndex('dasha_balance', ['userId']);

  console.log('✅ Dasha balance table created successfully!');
};

// Migration 9: Create Anthar Dasha Table
const createAntharDashaTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating anthar_dasha table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('anthar_dasha')) {
    console.log('⚠️  Anthar dasha table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('anthar_dasha', {
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

  await queryInterface.addIndex('anthar_dasha', ['userId']);
  await queryInterface.addIndex('anthar_dasha', ['setNo']);

  console.log('✅ Anthar dasha table created successfully!');
};



const createPredictionSunTable = async (queryInterface: QueryInterface) => {
  console.log('📝 Creating Prediction_sun table...');

  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('Prediction_sun')) {
    console.log('⚠️  Prediction Sun table already exists, skipping...');
    return;
  }

  await queryInterface.createTable('Prediction_sun', {
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

  await queryInterface.addIndex('Prediction_sun', ['userId']);

  console.log('✅ Prediction sun table created successfully!');
};






// Seed Default Data
const seedDefaultData = async (queryInterface: QueryInterface) => {
  console.log('📝 Seeding default data...');

  try {
    // Seed Gender data
    const [genderResults]: any = await sequelize.query('SELECT COUNT(*) as count FROM gender');
    if (genderResults[0].count === 0) {
      await queryInterface.bulkInsert('gender', [
        { type: 'Prefer not to say' },
        { type: 'Male' },
        { type: 'Female' },
        { type: 'Other' }
      ]);
      console.log('✅ Default genders seeded successfully');
    } else {
      console.log('⚠️  Gender data already exists, skipping seed...');
    }

    // Seed Birth Location data
    const [birthLocationResults]: any = await sequelize.query('SELECT COUNT(*) as count FROM birth_locations');
    if (birthLocationResults[0].count === 0) {
      await queryInterface.bulkInsert('birth_locations', [
        { name: 'Not Set Birth Location', longitude: null, latitude: null }
      ]);
      console.log('✅ Default birth location seeded successfully');
    } else {
      console.log('⚠️  Birth location data already exists, skipping seed...');
    }

    console.log('✅ All default data seeded successfully!');
  } catch (error) {
    console.error('⚠️  Error seeding data:', error);
  }
};




