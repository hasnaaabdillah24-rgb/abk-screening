import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { studentAPI } from '../utils/api';
import { SCREENING_CATEGORIES } from '../utils/constants';

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      toast.error('Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  const handleStartScreening = (category) => {
    if (selectedStudent) {
      navigate(`/screening/${selectedStudent.id}/${category}`);
      setShowCategoryModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{students.length}</div>
            <p className="text-gray-600">Total Siswa</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <p className="text-gray-600">Kategori Skrining</p>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Daftar Siswa</h2>
            <button
              onClick={() => navigate('/students')}
              className="btn btn-primary"
            >
              + Tambah Siswa
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              Tidak ada siswa. Silakan tambahkan siswa terlebih dahulu.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{student.full_name}</td>
                      <td className="px-4 py-3">{student.grade || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowCategoryModal(true);
                          }}
                          className="btn btn-secondary text-sm"
                        >
                          Mulai Skrining
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Pilih Kategori Skrining</h2>
            <div className="space-y-3">
              {Object.entries(SCREENING_CATEGORIES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleStartScreening(value)}
                  className="btn btn-primary w-full"
                >
                  {value}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCategoryModal(false)}
              className="btn w-full mt-4 bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;