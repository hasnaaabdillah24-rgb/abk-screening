import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    school_name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(formData);
      toast.success('Registrasi berhasil, silakan login');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Daftar</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nama Sekolah</label>
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;