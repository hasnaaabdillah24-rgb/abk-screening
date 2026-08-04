import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { screeningAPI, resultsAPI } from '../utils/api';
import { questionBank } from '../data/questionBank';

function ScreeningPage() {
  const { studentId, category } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    startScreening();
  }, [studentId, category]);

  const startScreening = async () => {
    try {
      const response = await screeningAPI.start({
        student_id: studentId,
        category,
      });
      setSession(response.data.session);
      
      // Get first question from local question bank
      const questions = questionBank[category] || [];
      if (questions.length > 0) {
        setCurrentQuestion({ ...questions[0], localId: 0 });
      }
      setProgress(0);
    } catch (error) {
      toast.error('Gagal memulai skrining');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (optionIndex, optionText) => {
    setAnswering(true);
    try {
      const answer = {
        session_id: session.id,
        question_id: currentQuestion.id || currentQuestion.localId,
        answer_text: optionText,
        answer_value: optionIndex + 1,
      };

      setResponses([...responses, answer]);

      // Get next question
      const questions = questionBank[category] || [];
      const nextIndex = currentQuestion.localId + 1;

      if (nextIndex < questions.length) {
        setCurrentQuestion({ ...questions[nextIndex], localId: nextIndex });
        setProgress(((nextIndex + 1) / questions.length) * 100);
      } else {
        // Screening complete
        completeScreening();
      }
    } catch (error) {
      toast.error('Gagal menyimpan jawaban');
    } finally {
      setAnswering(false);
    }
  };

  const completeScreening = async () => {
    try {
      await screeningAPI.complete(session.id);
      
      // Generate results
      const resultResponse = await resultsAPI.generate({
        session_id: session.id,
      });

      toast.success('Skrining selesai!');
      navigate(`/results/${session.id}`);
    } catch (error) {
      toast.error('Gagal menyelesaikan skrining');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Navbar />
        <p className="text-xl text-gray-600">Mempersiapkan skrining...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container py-8">
          <div className="card text-center">
            <p className="text-xl text-gray-600">Tidak ada pertanyaan tersedia</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% selesai
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="card mb-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentQuestion.question}
              </h3>
              {currentQuestion.description && (
                <p className="text-gray-600 italic">
                  Keterangan: {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options && currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index, option)}
                  disabled={answering}
                  className="w-full p-4 text-left border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <span className="font-medium text-gray-800">{index + 1}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400"
              disabled={answering}
            >
              Batalkan Skrining
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScreeningPage;