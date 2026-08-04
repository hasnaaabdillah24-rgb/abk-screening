import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ScreeningPage from './pages/ScreeningPage';
import ResultsPage from './pages/ResultsPage';
import StudentListPage from './pages/StudentListPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const { token } = useAuthStore();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/screening/:studentId/:category" element={<ScreeningPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
          </Route>

          <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;