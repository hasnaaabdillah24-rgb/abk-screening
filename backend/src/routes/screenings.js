const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const db = require('../database/db');
const authMiddleware = require('../middleware/auth');
const { SCREENING_STATUS } = require('../utils/constants');

const router = express.Router();
router.use(authMiddleware);

// Start screening session
router.post('/start', async (req, res) => {
  try {
    const schema = Joi.object({
      student_id: Joi.string().uuid().required(),
      category: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { student_id, category } = value;

    // Verify student belongs to teacher
    const studentCheck = await db.query(
      'SELECT * FROM students WHERE id = $1 AND teacher_id = $2',
      [student_id, req.user.id]
    );
    if (studentCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const sessionId = uuidv4();
    const result = await db.query(
      'INSERT INTO screening_sessions (id, student_id, teacher_id, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sessionId, student_id, req.user.id, category, SCREENING_STATUS.IN_PROGRESS]
    );

    // Get first question
    const questionResult = await db.query(
      'SELECT * FROM questions WHERE category = $1 AND parent_question_id IS NULL LIMIT 1',
      [category]
    );

    res.status(201).json({
      session: result.rows[0],
      firstQuestion: questionResult.rows[0] || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit answer
router.post('/answer', async (req, res) => {
  try {
    const schema = Joi.object({
      session_id: Joi.string().uuid().required(),
      question_id: Joi.string().uuid().required(),
      answer_id: Joi.string().uuid().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { session_id, question_id, answer_id } = value;

    // Get answer option
    const answerResult = await db.query(
      'SELECT * FROM answer_options WHERE id = $1 AND question_id = $2',
      [answer_id, question_id]
    );
    if (answerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Jawaban tidak ditemukan' });
    }

    const answerOption = answerResult.rows[0];

    // Save response
    await db.query(
      'INSERT INTO screening_responses (session_id, question_id, answer_id, answer_value) VALUES ($1, $2, $3, $4)',
      [session_id, question_id, answer_id, answerOption.option_value]
    );

    // Get next question
    let nextQuestion = null;
    if (answerOption.next_question_id) {
      const nextResult = await db.query(
        'SELECT * FROM questions WHERE id = $1',
        [answerOption.next_question_id]
      );
      nextQuestion = nextResult.rows[0] || null;
    } else {
      // Get any available question not yet answered
      const remainingResult = await db.query(
        `SELECT q.* FROM questions q
         LEFT JOIN screening_responses sr ON q.id = sr.question_id AND sr.session_id = $1
         WHERE q.category = (SELECT category FROM screening_sessions WHERE id = $1)
         AND sr.id IS NULL
         LIMIT 1`,
        [session_id]
      );
      nextQuestion = remainingResult.rows[0] || null;
    }

    res.json({
      message: 'Jawaban tersimpan',
      nextQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete screening
router.post('/complete/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    await db.query(
      'UPDATE screening_sessions SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2',
      [SCREENING_STATUS.COMPLETED, sessionId]
    );

    res.json({ message: 'Skrining selesai' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;