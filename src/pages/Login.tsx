import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook, Twitter, Instagram, Youtube, Scissors } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/editor');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsDemo();
      toast.success('Demo mode activated!');
      navigate('/editor');
    } catch (error) {
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Scissors className="text-indigo-600" size={24} />
                <span className="text-xl font-bold text-gray-900 ml-2">SnipX</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Welcome back to SnipX
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-xl">
            Log in to access your AI-powered video editing dashboard
          </p>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
              <p className="text-gray-600 mt-2">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                disabled={isLoading}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                Google
              </button>
              <button 
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Facebook size={16} className="mr-2" />
                Facebook
              </button>
            </div>

            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo Account Info */}
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-md p-4">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Try Demo Mode</h4>
              <p className="text-xs text-indigo-600 mb-3">
                Experience SnipX features without creating an account
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-indigo-100 text-indigo-700 py-2 px-4 rounded-md font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50 border border-indigo-200"
              >
                {isLoading ? 'Starting Demo...' : 'Enter Demo Mode'}
              </button>
              <p className="text-xs text-indigo-500 mt-2">
                Or use credentials: demo@snipx.com / demo1234
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <Link to="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Scissors className="text-indigo-600" size={24} />
              <span className="text-xl font-bold text-gray-900 ml-2">SnipX</span>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-gray-600">
              &copy; {new Date().getFullYear()} SnipX Technologies. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-indigo-500">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-indigo-500">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-indigo-500">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-indigo-500">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;