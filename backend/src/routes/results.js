const express = require('express');
const db = require('../database/db');
const authMiddleware = require('../middleware/auth');
const ScreeningAnalyzer = require('../utils/screeningAnalyzer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(authMiddleware);

// Get results for session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sr.* FROM screening_results sr
       JOIN screening_sessions ss ON sr.session_id = ss.id
       WHERE sr.session_id = $1 AND ss.teacher_id = $2`,
      [req.params.sessionId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hasil tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all results for student
router.get('/student/:studentId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sr.* FROM screening_results sr
       JOIN students s ON sr.student_id = s.id
       WHERE sr.student_id = $1 AND s.teacher_id = $2
       ORDER BY sr.created_at DESC`,
      [req.params.studentId, req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate and save results
router.post('/generate', async (req, res) => {
  try {
    const { session_id } = req.body;

    // Get session and responses
    const sessionResult = await db.query(
      'SELECT * FROM screening_sessions WHERE id = $1 AND teacher_id = $2',
      [session_id, req.user.id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session tidak ditemukan' });
    }

    const session = sessionResult.rows[0];

    const responsesResult = await db.query(
      'SELECT * FROM screening_responses WHERE session_id = $1',
      [session_id]
    );

    const responses = responsesResult.rows;

    // Analyze
    const analysis = ScreeningAnalyzer.analyzeScreening(responses, session.category);

    // Save results
    const resultId = uuidv4();
    const saveResult = await db.query(
      `INSERT INTO screening_results 
       (id, session_id, student_id, teacher_id, category, total_score, max_score, percentage, confidence_level, 
        initial_indication, severity_level, analysis_summary, teacher_recommendations, parent_recommendations, professional_consultation_needed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        resultId,
        session_id,
        session.student_id,
        session.teacher_id,
        session.category,
        analysis.totalScore,
        analysis.maxScore,
        analysis.percentage,
        analysis.confidenceLevel,
        analysis.initialIndication,
        analysis.severityLevel,
        analysis.analysisSummary,
        JSON.stringify(analysis.teacherRecommendations),
        JSON.stringify(analysis.parentRecommendations),
        analysis.professionalConsultationNeeded,
      ]
    );

    res.json(saveResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;