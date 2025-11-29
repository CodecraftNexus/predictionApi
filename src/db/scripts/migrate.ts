import { runMigrations } from '../migrations';
import { sequelize } from '../sequelize';

const migrate = async () => {
  try {
    console.log('🚀 Starting database migration...');
    await runMigrations();
    console.log('✅ Migration completed successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

migrate();