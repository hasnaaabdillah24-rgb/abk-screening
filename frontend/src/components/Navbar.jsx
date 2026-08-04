import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container flex justify-between items-center py-4">
        <Link to="/dashboard" className="text-2xl font-bold">
          🎓 ABK Screening
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm">{user?.full_name}</span>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;