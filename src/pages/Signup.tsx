import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Facebook, Twitter, Instagram, Youtube, Scissors, Sparkles } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setErrors(errs => ({ ...errs, [name]: '' }));
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signupSchema.parse(formData);
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Account created—redirecting!');
        navigate('/login');
      } else {
        alert(`Signup failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          const field = e.path[0]?.toString();
          if (field) fieldErrors[field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        alert('Unexpected error, check console');
      }
    }
  };

  // OAuth handlers
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google/login';
  };
  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/facebook/login';
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

        {/* Floating 3D Signup Elements */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            top: '5%',
            left: '5%',
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
            top: '70%',
            right: '5%',
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
            top: '15%',
            right: '15%',
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
            className="text-4xl font-extrabold tracking-tight sm:text-5xl animate-slide-up-3d"
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.3)'
            }}
          >
            Join SnipX Today
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-xl animate-fade-in-up-3d">
            Create your account and start editing videos with AI
          </p>
        </div>
      </div>

      {/* Enhanced Signup Form */}
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
              <h2 className="text-2xl font-bold text-white animate-slide-in-3d">Create your account</h2>
              <p className="text-gray-300 mt-2 animate-fade-in-3d">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Enhanced Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={handleGoogleLogin} 
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white py-2 px-4 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 btn-3d animate-slide-in-left-3d"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                 Google
              </button>
              <button 
                onClick={handleFacebookLogin} 
                className="bg-blue-600/80 backdrop-blur-sm text-white py-2 px-4 rounded-xl flex items-center justify-center hover:bg-blue-700/80 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 btn-3d animate-slide-in-right-3d border border-blue-400/30"
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

            {/* Enhanced Signup Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="animate-slide-in-left-3d">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400 ${errors.firstName ? 'border-red-500' : 'border-white/30'}`}
                    placeholder="First name"
                    required
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
                </div>
                <div className="animate-slide-in-right-3d">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400 ${errors.lastName ? 'border-red-500' : 'border-white/30'}`}
                    placeholder="Last name"
                    required
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-6 animate-slide-in-left-3d">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                <input
                  type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-white/30'}`}
                    placeholder="Enter your email"
                    required
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="mb-6 animate-slide-in-right-3d">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-white/30'}`}
                    placeholder="Create a password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-300 transform hover:scale-110">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}

                {/* Enhanced Password Strength Indicator */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Password strength</span>
                    <span className={`${passwordStrength >= 3 ? 'text-green-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}> 
                      {['Weak','Fair','Good','Strong','Very Strong'][passwordStrength]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= 3 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        passwordStrength >= 2 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{width: `${(passwordStrength/4)*100}%`}}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 animate-slide-in-left-3d">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg text-white placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-white/30'}`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-300 transform hover:scale-110">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center mb-6 animate-slide-up-3d">
                <input id="terms" type="checkbox" required className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-300 transform hover:scale-110" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Privacy Policy</Link>.
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-3d animate-slide-up-3d"
                style={{
                  boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)'
                }}
              >
                Create Account
              </button>
            </form>

            {/* Enhanced Verification Notice */}
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-xl p-4 animate-slide-up-3d">
              <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                <Sparkles className="mr-2" size={16} />
                Email Verification
              </h4>
              <p className="text-xs text-gray-300">
                We'll send a verification link to your email address to activate your account.
              </p>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="bg-white/5 backdrop-blur-md px-8 py-6 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Terms of Service</Link>{' '}
              and{' '}
              <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">Privacy Policy</Link>.
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

export default Signup;