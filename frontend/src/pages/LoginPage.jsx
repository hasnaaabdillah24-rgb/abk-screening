import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';

function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      setAuth(response.data.token, response.data.user);
      toast.success('Login berhasil');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">ABK Screening</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;