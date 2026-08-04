const { CONFIDENCE_LEVELS, SEVERITY_LEVELS } = require('./constants');

class ScreeningAnalyzer {
  /**
   * Analisis hasil skrining dan hasilkan indikasi awal
   */
  static analyzeScreening(responses, category) {
    const totalScore = responses.reduce((sum, r) => sum + r.answer_value, 0);
    const maxScore = responses.length * 5; // Assuming max 5 per answer
    const percentage = (totalScore / maxScore) * 100;
    const confidenceLevel = this.calculateConfidence(responses);
    const severityLevel = this.determineSeverityLevel(percentage, category);
    const initialIndication = this.determineIndication(percentage, category);

    return {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      confidenceLevel,
      severityLevel,
      initialIndication,
      analysisSummary: this.generateSummary(percentage, category, severityLevel),
      teacherRecommendations: this.generateTeacherRecommendations(category, severityLevel),
      parentRecommendations: this.generateParentRecommendations(category, severityLevel),
      professionalConsultationNeeded: percentage >= 60,
    };
  }

  static calculateConfidence(responses) {
    // Confidence increases with consistent answers
    if (responses.length < 3) return CONFIDENCE_LEVELS.LOW;
    
    const avgScore = responses.reduce((sum, r) => sum + r.answer_value, 0) / responses.length;
    const variance = responses.reduce((sum, r) => sum + Math.pow(r.answer_value - avgScore, 2), 0) / responses.length;
    
    if (variance < 0.5) return CONFIDENCE_LEVELS.VERY_HIGH;
    if (variance < 1) return CONFIDENCE_LEVELS.HIGH;
    if (variance < 2) return CONFIDENCE_LEVELS.MODERATE;
    return CONFIDENCE_LEVELS.LOW;
  }

  static determineSeverityLevel(percentage, category) {
    if (percentage < 20) return SEVERITY_LEVELS.VERY_MILD;
    if (percentage < 40) return SEVERITY_LEVELS.MILD;
    if (percentage < 60) return SEVERITY_LEVELS.MODERATE;
    if (percentage < 80) return SEVERITY_LEVELS.SEVERE;
    return SEVERITY_LEVELS.VERY_SEVERE;
  }

  static determineIndication(percentage, category) {
    const likely = percentage >= 60;
    
    const indications = {
      ADHD: likely ? 'Kemungkinan ADHD' : 'ADHD tidak mungkin',
      ASD: likely ? 'Kemungkinan ASD' : 'ASD tidak mungkin',
      Disleksia: likely ? 'Kemungkinan Disleksia' : 'Disleksia tidak mungkin',
      'Gangguan Perilaku Emosional': likely ? 'Kemungkinan Gangguan Perilaku Emosional' : 'Gangguan Perilaku Emosional tidak mungkin',
    };
    
    return indications[category] || 'Tidak dapat ditentukan';
  }

  static generateSummary(percentage, category, severityLevel) {
    return `Berdasarkan observasi yang telah dilakukan, anak menunjukkan tingkat gejala ${category.toLowerCase()} pada level ${severityLevel.toLowerCase()} dengan skor ${percentage.toFixed(1)}%. Diperlukan observasi lebih lanjut dan konsultasi dengan profesional untuk diagnosis yang akurat.`;
  }

  static generateTeacherRecommendations(category, severityLevel) {
    const recommendations = {
      ADHD: [
        'Berikan instruksi yang jelas dan singkat',
        'Gunakan visual aids dalam mengajar',
        'Berikan reward untuk perilaku positif',
        'Buat jadwal yang terstruktur dan konsisten',
        'Batasi gangguan di dalam kelas',
      ],
      ASD: [
        'Gunakan visual schedule dan routine',
        'Kurangi stimuli sensorik yang berlebih',
        'Berikan waktu transisi antar aktivitas',
        'Gunakan komunikasi yang konkret',
        'Ciptakan area safe space untuk anak',
      ],
      Disleksia: [
        'Gunakan multi-sensory learning approach',
        'Berikan extra time untuk membaca dan menulis',
        'Gunakan color-coded materials',
        'Fokus pada audio dan oral learning',
        'Berikan reading support tools',
      ],
      'Gangguan Perilaku Emosional': [
        'Bangun hubungan positif dengan anak',
        'Gunakan positive behavior support',
        'Ajarkan emotional regulation strategies',
        'Komunikasikan dengan orang tua secara regular',
        'Ciptakan lingkungan yang predictable dan safe',
      ],
    };
    
    return recommendations[category] || [];
  }

  static generateParentRecommendations(category, severityLevel) {
    const recommendations = {
      ADHD: [
        'Ciptakan rutinitas yang konsisten di rumah',
        'Berikan break time yang cukup',
        'Monitor penggunaan screen time',
        'Dorong aktivitas fisik regular',
        'Komunikasi dengan guru secara berkala',
      ],
      ASD: [
        'Buat rutinitas yang jelas dan predictable',
        'Ciptakan lingkungan yang calm dan organized',
        'Dorong social interaction dalam setting yang comfortable',
        'Gunakan visual supports di rumah',
        'Konsultasi dengan specialist',
      ],
      Disleksia: [
        'Baca bersama anak secara regular',
        'Tidak memaksakan membaca saat anak lelah',
        'Gunakan audiobooks sebagai alternative',
        'Berikan encouragement dan positive feedback',
        'Cari tutor atau specialist jika perlu',
      ],
      'Gangguan Perilaku Emosional': [
        'Dengarkan dan validate perasaan anak',
        'Ajarkan coping strategies',
        'Hindari punishment yang harsh',
        'Ciptakan supporting environment',
        'Cari professional help jika diperlukan',
      ],
    };
    
    return recommendations[category] || [];
  }
}

module.exports = ScreeningAnalyzer;