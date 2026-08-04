const db = require('./db');
const { v4: uuidv4 } = require('uuid');

// Data seed untuk question bank
const questions = [
  // ADHD Questions
  {
    id: uuidv4(),
    category: 'ADHD',
    question_text: 'Apakah anak sering kesulitan memusatkan perhatian pada tugas atau kegiatan?',
    question_type: 'likert',
    difficulty_level: 1,
    parent_question_id: null,
  },
  {
    id: uuidv4(),
    category: 'ADHD',
    question_text: 'Apakah anak mudah terganggu oleh hal-hal di sekitarnya?',
    question_type: 'likert',
    difficulty_level: 1,
    parent_question_id: null,
  },
  // ASD Questions
  {
    id: uuidv4(),
    category: 'ASD',
    question_text: 'Apakah anak mengalami kesulitan dalam interaksi sosial?',
    question_type: 'likert',
    difficulty_level: 1,
    parent_question_id: null,
  },
  // Disleksia Questions
  {
    id: uuidv4(),
    category: 'Disleksia',
    question_text: 'Apakah anak mengalami kesulitan dalam membaca?',
    question_type: 'likert',
    difficulty_level: 1,
    parent_question_id: null,
  },
  // Gangguan Perilaku Emosional Questions
  {
    id: uuidv4(),
    category: 'Gangguan Perilaku Emosional',
    question_text: 'Apakah anak sering menunjukkan perilaku agresif atau marah?',
    question_type: 'likert',
    difficulty_level: 1,
    parent_question_id: null,
  },
];

// Answer options untuk setiap question
const answerOptions = [
  {
    id: uuidv4(),
    question_id: questions[0].id,
    option_text: 'Tidak pernah',
    option_value: 1,
  },
  {
    id: uuidv4(),
    question_id: questions[0].id,
    option_text: 'Jarang (1-2 kali seminggu)',
    option_value: 2,
  },
  {
    id: uuidv4(),
    question_id: questions[0].id,
    option_text: 'Kadang-kadang (3-4 kali seminggu)',
    option_value: 3,
  },
  {
    id: uuidv4(),
    question_id: questions[0].id,
    option_text: 'Sering (hampir setiap hari)',
    option_value: 4,
  },
  {
    id: uuidv4(),
    question_id: questions[0].id,
    option_text: 'Selalu (setiap hari, sepanjang waktu)',
    option_value: 5,
  },
];

async function seedDatabase() {
  try {
    console.log('\n🌱 Seeding database...');

    // Insert questions
    for (const question of questions) {
      await db.query(
        'INSERT INTO questions (id, category, question_text, question_type, difficulty_level, parent_question_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [question.id, question.category, question.question_text, question.question_type, question.difficulty_level, question.parent_question_id]
      );
    }

    // Insert answer options
    for (const option of answerOptions) {
      await db.query(
        'INSERT INTO answer_options (id, question_id, option_text, option_value) VALUES ($1, $2, $3, $4)',
        [option.id, option.question_id, option.option_text, option.option_value]
      );
    }

    console.log('✅ Seed data berhasil ditambahkan!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();