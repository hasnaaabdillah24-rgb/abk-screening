const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const db = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const studentSchema = Joi.object({
  full_name: Joi.string().required(),
  date_of_birth: Joi.date().optional(),
  gender: Joi.string().valid('Laki-laki', 'Perempuan', 'Lainnya').optional(),
  grade: Joi.string().optional(),
  description: Joi.string().optional(),
});

// Get all students for teacher
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM students WHERE teacher_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM students WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Siswa tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO students (id, teacher_id, full_name, date_of_birth, gender, grade, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, req.user.id, value.full_name, value.date_of_birth, value.gender, value.grade, value.description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = studentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    // Check if student belongs to user
    const checkResult = await db.query(
      'SELECT * FROM students WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses' });
    }

    const result = await db.query(
      'UPDATE students SET full_name = $1, date_of_birth = $2, gender = $3, grade = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [value.full_name, value.date_of_birth, value.gender, value.grade, value.description, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const checkResult = await db.query(
      'SELECT * FROM students WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Anda tidak memiliki akses' });
    }

    await db.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ message: 'Siswa berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;