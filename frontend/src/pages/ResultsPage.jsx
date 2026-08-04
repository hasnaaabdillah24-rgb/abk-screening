import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '../components/Navbar';
import { resultsAPI } from '../utils/api';

function ResultsPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const response = await resultsAPI.getBySession(sessionId);
      setResult(response.data);
    } catch (error) {
      toast.error('Gagal memuat hasil skrining');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const element = document.getElementById('report-content');
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`laporan-skrining-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Laporan berhasil diunduh');
    } catch (error) {
      toast.error('Gagal membuat PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <p className="text-xl text-gray-600">Memuat hasil skrining...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <div className="card text-center">
            <p className="text-xl text-gray-600">Hasil tidak ditemukan</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary mt-4"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (level) => {
    const colors = {
      'Sangat Ringan': 'bg-green-100 text-green-800',
      'Ringan': 'bg-lime-100 text-lime-800',
      'Sedang': 'bg-yellow-100 text-yellow-800',
      'Berat': 'bg-orange-100 text-orange-800',
      'Sangat Berat': 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Hasil Skrining</h1>
            <div className="space-x-2">
              <button
                onClick={generatePDF}
                className="btn btn-primary"
              >
                📥 Download PDF
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Kembali
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div id="report-content" className="space-y-6 bg-white p-8 rounded-lg">
            {/* Summary Card */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Ringkasan Hasil</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{result.percentage?.toFixed(1)}%</div>
                  <p className="text-gray-600 text-sm">Skor Persentase</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{(result.confidence_level * 100)?.toFixed(0)}%</div>
                  <p className="text-gray-600 text-sm">Tingkat Keyakinan</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">{result.total_score}/{result.max_score}</div>
                  <p className="text-gray-600 text-sm">Skor Total</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${getSeverityColor(result.severity_level)}`}>
                  <div className="text-lg font-bold">{result.severity_level}</div>
                  <p className="text-sm">Tingkat Keparahan</p>
                </div>
              </div>
            </div>

            {/* Indication Card */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Kemungkinan Indikasi</h2>
              <div className={`p-4 rounded-lg ${result.initial_indication.includes('Kemungkinan') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                <p className="text-xl font-bold">{result.initial_indication}</p>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Analisis</h2>
              <p className="text-gray-700 leading-relaxed">{result.analysis_summary}</p>
            </div>

            {/* Teacher Recommendations */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Rekomendasi untuk Guru</h2>
              <ul className="space-y-2">
                {result.teacher_recommendations && typeof result.teacher_recommendations === 'string'
                  ? JSON.parse(result.teacher_recommendations).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-blue-600 font-bold mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))
                  : Array.isArray(result.teacher_recommendations) && result.teacher_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-blue-600 font-bold mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))
                }
              </ul>
            </div>

            {/* Parent Recommendations */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Rekomendasi untuk Orang Tua</h2>
              <ul className="space-y-2">
                {result.parent_recommendations && typeof result.parent_recommendations === 'string'
                  ? JSON.parse(result.parent_recommendations).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))
                  : Array.isArray(result.parent_recommendations) && result.parent_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))
                }
              </ul>
            </div>

            {/* Professional Consultation */}
            {result.professional_consultation_needed && (
              <div className="card bg-red-50 border-2 border-red-300">
                <h2 className="text-2xl font-bold mb-4 text-red-800">⚠️ Saran Konsultasi Profesional</h2>
                <p className="text-red-700 leading-relaxed">
                  Berdasarkan hasil skrining, sangat disarankan untuk melakukan konsultasi lebih lanjut dengan profesional
                  seperti psikolog klinis, dokter spesialis anak, atau ahli pendidikan khusus untuk mendapatkan diagnosis
                  dan intervensi yang lebih akurat dan komprehensif.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="card bg-blue-50 border-2 border-blue-300">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Penting:</strong> Hasil skrining ini hanya merupakan indikasi awal dan bukan merupakan diagnosis medis final.
                Skrining ini dirancang untuk membantu guru dalam mengidentifikasi siswa yang mungkin memerlukan perhatian khusus.
                Keputusan diagnosis final harus dibuat oleh profesional kesehatan yang berkualifikasi setelah melakukan evaluasi
                yang lebih mendalam dan komprehensif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;