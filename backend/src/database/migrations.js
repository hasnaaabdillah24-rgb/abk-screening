const fs = require('fs');
const path = require('path');

// Migration untuk membuat database schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

const db = require('./db');

async function runMigrations() {
  try {
    console.log('\n🔄 Menjalankan migrasi database...');
    
    // Eksekusi semua SQL statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await db.query(statement);
    }
    
    console.log('✅ Migrasi database berhasil!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrasi database:', error.message);
    process.exit(1);
  }
}

runMigrations();