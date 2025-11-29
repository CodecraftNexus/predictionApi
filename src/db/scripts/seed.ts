import { sequelize } from '../sequelize';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    const queryInterface = sequelize.getQueryInterface();

    // Seed Gender data
    console.log('📝 Seeding gender data...');
    const [genderResults]: any = await sequelize.query('SELECT COUNT(*) as count FROM gender');
    if (genderResults[0].count === 0) {
      await queryInterface.bulkInsert('gender', [
        { type: 'Prefer not to say' },
        { type: 'Male' },
        { type: 'Female' },
        { type: 'Other' }
      ]);
      console.log('✅ Genders seeded successfully');
    } else {
      console.log('⚠️  Gender data already exists');
    }

    // Seed Birth Location data
    console.log('📝 Seeding birth location data...');
    const [birthLocationResults]: any = await sequelize.query('SELECT COUNT(*) as count FROM birth_locations');
    if (birthLocationResults[0].count === 0) {
      await queryInterface.bulkInsert('birth_locations', [
        { name: 'Not Set Birth Location', longitude: null, latitude: null }
      ]);
      console.log('✅ Birth location seeded successfully');
    } else {
      console.log('⚠️  Birth location data already exists');
    }

    console.log('✅ Seeding completed successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await sequelize.close();
    process.exit(1);
  }
};

seed();