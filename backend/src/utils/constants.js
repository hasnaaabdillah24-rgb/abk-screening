// Kategori Skrining
const SCREENING_CATEGORIES = {
  ADHD: 'ADHD',
  ASD: 'ASD',
  DYSLEXIA: 'Disleksia',
  EMOTIONAL_BEHAVIORAL: 'Gangguan Perilaku Emosional',
};

// Status Skrining
const SCREENING_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
};

// Tingkat Keyakinan (Confidence Level)
const CONFIDENCE_LEVELS = {
  LOW: 0.4,
  MODERATE: 0.6,
  HIGH: 0.8,
  VERY_HIGH: 0.95,
};

// Tingkat Keparahan (Severity Levels)
const SEVERITY_LEVELS = {
  VERY_MILD: 'Sangat Ringan',
  MILD: 'Ringan',
  MODERATE: 'Sedang',
  SEVERE: 'Berat',
  VERY_SEVERE: 'Sangat Berat',
};

// Indikasi Awal
const INITIAL_INDICATIONS = {
  ADHD_LIKELY: 'Kemungkinan ADHD',
  ADHD_UNLIKELY: 'ADHD tidak mungkin',
  ASD_LIKELY: 'Kemungkinan ASD',
  ASD_UNLIKELY: 'ASD tidak mungkin',
  DYSLEXIA_LIKELY: 'Kemungkinan Disleksia',
  DYSLEXIA_UNLIKELY: 'Disleksia tidak mungkin',
  EMOTIONAL_BEHAVIORAL_LIKELY: 'Kemungkinan Gangguan Perilaku Emosional',
  EMOTIONAL_BEHAVIORAL_UNLIKELY: 'Gangguan Perilaku Emosional tidak mungkin',
};

module.exports = {
  SCREENING_CATEGORIES,
  SCREENING_STATUS,
  CONFIDENCE_LEVELS,
  SEVERITY_LEVELS,
  INITIAL_INDICATIONS,
};