import { sequelize } from '../sequelize';

const rollback = async () => {
  try {
    console.log('🔄 Starting database rollback...');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Drop tables in reverse order (respecting foreign keys)
    const tables = [
      'anthar_dasha',
      'dasha_balance',
      'planet_house',
      'api_key',
      'oauth_accounts',
      'refresh_tokens',
      'users',
      'birth_locations',
      'gender'
    ];

    for (const table of tables) {
      try {
        console.log(`🗑️  Dropping ${table} table...`);
        await queryInterface.dropTable(table);
        console.log(`✅ ${table} dropped successfully`);
      } catch (error: any) {
        if (error.message.includes("doesn't exist")) {
          console.log(`⚠️  Table ${table} doesn't exist, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Rollback completed successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

rollback();
