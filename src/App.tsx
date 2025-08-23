import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Editor from './components/VideoEditor';
import Features from './pages/Features';
import Technologies from './pages/Technologies';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Help from './pages/Help';
import AdminTickets from './pages/AdminTickets';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './components/AuthCallback';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/editor" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/editor" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="*"
            element={
              <>
                <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/technologies" element={<Technologies />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
                    <Route path="/admin/tickets" element={isAuthenticated ? <AdminTickets /> : <Navigate to="/login" />} />
                    <Route path="/help" element={<Help />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;