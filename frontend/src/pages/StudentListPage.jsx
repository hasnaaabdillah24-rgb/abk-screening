import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { studentAPI } from '../utils/api';

function StudentListPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    grade: '',
    description: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await studentAPI.update(editingId, formData);
        toast.success('Siswa berhasil diperbarui');
      } else {
        await studentAPI.create(formData);
        toast.success('Siswa berhasil ditambahkan');
      }
      setFormData({ full_name: '', date_of_birth: '', gender: '', grade: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      toast.error('Operasi gagal');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus siswa ini?')) {
      try {
        await studentAPI.delete(id);
        toast.success('Siswa berhasil dihapus');
        fetchStudents();
      } catch (error) {
        toast.error('Gagal menghapus siswa');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Daftar Siswa</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ full_name: '', date_of_birth: '', gender: '', grade: '', description: '' });
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            + Tambah Siswa
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input"
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kelas</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="input"
                  placeholder="Contoh: 1A, 2B, 3C"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Catatan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="3"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingId ? 'Update' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn bg-gray-300 text-gray-800 flex-1"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
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
                    <th className="px-4 py-3">Jenis Kelamin</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{student.full_name}</td>
                      <td className="px-4 py-3">{student.grade || '-'}</td>
                      <td className="px-4 py-3">{student.gender || '-'}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(student.id);
                            setFormData(student);
                            setShowForm(true);
                          }}
                          className="btn bg-blue-500 text-white text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="btn btn-danger text-sm"
                        >
                          Hapus
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
    </div>
  );
}

export default StudentListPage;