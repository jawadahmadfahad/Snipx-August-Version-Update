import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook, Twitter, Instagram, Youtube, Scissors, Sparkles, Zap, Brain, Shield, Cpu } from 'lucide-react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(0px)`,
            animation: 'grid-flow 20s linear infinite'
          }}
        />

        {/* Floating 3D Login Elements */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
            transform: `
              translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0)
              rotateX(${mousePosition.y * 0.1}deg)
              rotateY(${mousePosition.x * 0.1}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-3d 12s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            top: '60%',
            right: '10%',
            transform: `
              translate3d(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px, 0)
              rotateX(${mousePosition.y * -0.08}deg)
              rotateY(${mousePosition.x * -0.08}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-3d-delayed 15s ease-in-out infinite'
          }}
        />

        {/* 3D Geometric Shapes */}
        <div 
          className="absolute w-32 h-32 opacity-30"
          style={{
            top: '20%',
            right: '20%',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6))',
            transform: `
              translate3d(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px, 0)
              rotateX(${45 + mousePosition.y * 0.2}deg)
              rotateY(${45 + mousePosition.x * 0.2}deg)
              rotateZ(${mousePosition.x * 0.1}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'spin-3d 20s linear infinite',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />

        <div 
          className="absolute w-24 h-24 opacity-50"
          style={{
            bottom: '30%',
            left: '15%',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6))',
            transform: `
              translate3d(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px, 0)
              rotateX(${mousePosition.y * 0.15}deg)
              rotateY(${mousePosition.x * 0.15}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'bounce-3d 8s ease-in-out infinite',
            borderRadius: '20%'
          }}
        />

        {/* Floating Tech Icons */}
        {[Brain, Shield, Cpu, Zap].map((Icon, index) => (
          <div
            key={index}
            className="absolute opacity-40"
            style={{
              top: `${20 + index * 20}%`,
              left: `${80 + Math.sin(index) * 15}%`,
              transform: `
                translate3d(${mousePosition.x * (0.01 + index * 0.005)}px, ${mousePosition.y * (0.01 + index * 0.005)}px, 0)
                rotateX(${mousePosition.y * 0.1}deg)
                rotateY(${mousePosition.x * 0.1}deg)
                rotateZ(${index * 90}deg)
              `,
              transition: 'transform 0.3s ease-out',
              animation: `tech-float-${index} ${8 + index * 2}s ease-in-out infinite`
            }}
          >
            <Icon className="w-12 h-12 text-purple-400 drop-shadow-lg" />
          </div>
        ))}

        {/* Floating Sparkles */}
        <div className="absolute top-1/4 left-1/3 animate-sparkle-3d">
          <Sparkles className="text-purple-400/40 w-6 h-6 transform-gpu" style={{ transform: 'rotateZ(45deg)' }} />
        </div>
        <div className="absolute top-2/3 right-1/2 animate-sparkle-3d-delayed">
          <Sparkles className="text-pink-400/40 w-4 h-4 transform-gpu" style={{ transform: 'rotateZ(-30deg)' }} />
        </div>

        {/* Particle System */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `
                translate3d(${mousePosition.x * (0.005 + i * 0.001)}px, ${mousePosition.y * (0.005 + i * 0.001)}px, 0)
              `,
              transition: 'transform 0.3s ease-out',
              animation: `particle-float-${i % 6} ${10 + i * 0.3}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center animate-slide-in-left-3d">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <div className="relative">
                  <Scissors className="text-purple-400 mr-3 transform group-hover:rotate-12 transition-all duration-300 animate-pulse-3d" size={28} />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Snip<span className="text-teal-400">X</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center animate-slide-in-right-3d">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden">
        {/* 3D Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-12 h-12 border-2 border-white rounded-full animate-float-3d"></div>
          <div className="absolute top-16 right-16 w-8 h-8 border-2 border-white transform rotate-45 animate-bounce-3d"></div>
          <div className="absolute bottom-8 left-1/3 w-6 h-6 bg-white rounded-full animate-pulse-3d"></div>
        </div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 
            className="text-5xl font-extrabold tracking-tight sm:text-6xl animate-slide-up-3d"
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.3)',
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 25%, #ec4899 50%, #3b82f6 75%, #ffffff 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 4s ease-in-out infinite'
            }}
          >
            Welcome back to SnipX
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl animate-fade-in-up-3d">
            Log in to access your AI-powered video editing dashboard
          </p>
        </div>
      </div>

      {/* Enhanced Login Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div 
          className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-slide-up-3d"
          style={{
            transform: `
              perspective(1000px)
              rotateX(${mousePosition.y * 0.02}deg)
              rotateY(${mousePosition.x * 0.02}deg)
              translateZ(20px)
            `,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full mb-6 backdrop-blur-md border border-white/20">
                <Shield className="text-purple-400 animate-pulse-3d" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white animate-slide-in-3d">Sign in to your account</h2>
              <p className="text-gray-300 mt-2 animate-fade-in-3d">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center hover:bg-white/30 hover:border-white/50 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 hover:-translate-y-1 btn-3d animate-slide-in-left-3d"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                Google
              </button>
              <button 
                disabled={isLoading}
                className="bg-blue-600/80 backdrop-blur-sm text-white py-3 px-4 rounded-xl flex items-center justify-center hover:bg-blue-700/80 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 hover:-translate-y-1 btn-3d animate-slide-in-right-3d border border-blue-400/30"
              >
                <Facebook size={16} className="mr-2" />
                Facebook
              </button>
            </div>

            <div className="relative flex items-center mb-6 animate-fade-in-3d">
              <div className="flex-grow border-t border-white/30"></div>
              <span className="flex-shrink mx-4 text-gray-300">or</span>
              <div className="flex-grow border-t border-white/30"></div>
            </div>

            {/* Enhanced Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-slide-in-left-3d">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="animate-slide-in-right-3d">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-300 transform hover:scale-110"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 animate-slide-up-3d">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-300 transform hover:scale-110"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="#" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 hover:shadow-lg btn-3d animate-slide-up-3d"
                disabled={isLoading}
                style={{
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin-3d rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Enhanced Demo Account Info */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border-2 border-purple-400/30 rounded-xl p-6 animate-slide-up-3d">
              <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                <Sparkles className="mr-2" size={16} />
                Try Demo Mode
              </h4>
              <p className="text-xs text-gray-300 mb-3">
                Experience SnipX features without creating an account
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 py-3 px-4 rounded-xl font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 disabled:opacity-50 border-2 border-purple-400/30 transform hover:scale-105 hover:shadow-lg btn-3d"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin-3d rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
                    Starting Demo...
                  </div>
                ) : (
                  'Enter Demo Mode'
                )}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Or use credentials: demo@snipx.com / demo1234
              </p>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="bg-white/5 backdrop-blur-md px-8 py-6 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our{' '}
              <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white/10 backdrop-blur-md mt-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center animate-slide-in-left-3d">
              <Scissors className="text-purple-400 animate-pulse-3d" size={24} />
              <span className="text-xl font-bold text-white ml-2">SnipX</span>
            </div>
            <p className="mt-4 md:mt-0 text-sm text-gray-400 animate-fade-in-3d">
              &copy; {new Date().getFullYear()} SnipX Technologies. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 animate-slide-in-right-3d">
              {[Twitter, Facebook, Instagram, Youtube].map((Icon, index) => (
                <Link 
                  key={index}
                  to="#" 
                  className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes grid-flow {
          0% { transform: perspective(1000px) rotateX(60deg) translateZ(0px) translateY(0px); }
          100% { transform: perspective(1000px) rotateX(60deg) translateZ(0px) translateY(-50px); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes tech-float-0 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(180deg); }
        }
        
        @keyframes tech-float-1 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-15px) rotateZ(-180deg); }
        }
        
        @keyframes tech-float-2 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-25px) rotateZ(90deg); }
        }
        
        @keyframes tech-float-3 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-18px) rotateZ(-90deg); }
        }
        
        @keyframes particle-float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.8; }
        }
        
        @keyframes particle-float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-80px) translateX(-15px); opacity: 0.7; }
        }
        
        @keyframes particle-float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { transform: translateY(-120px) translateX(10px); opacity: 0.9; }
        }
        
        @keyframes particle-float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-90px) translateX(-25px); opacity: 0.6; }
        }
        
        @keyframes particle-float-4 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-110px) translateX(30px); opacity: 0.8; }
        }
        
        @keyframes particle-float-5 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
          50% { transform: translateY(-95px) translateX(-20px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Login;