import { ArrowRight, Play, Sparkles, Video, Scissors, Volume2, Image, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const Hero3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={{
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
    >
      {/* 3D Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `perspective(1000px) rotateX(60deg) translateZ(0px)`,
            animation: 'grid-flow 20s linear infinite'
          }}
        />
      </div>

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Floating Orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-30"
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
            animation: 'float-3d 8s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-80 h-80 rounded-full opacity-25"
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
            animation: 'float-3d-delayed 10s ease-in-out infinite'
          }}
        />

        {/* 3D Geometric Shapes */}
        <div 
          className="absolute w-32 h-32 opacity-40"
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
            animation: 'spin-3d 15s linear infinite',
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
            animation: 'bounce-3d 6s ease-in-out infinite',
            borderRadius: '20%'
          }}
        />

        {/* Floating Tech Icons */}
        {[
          { Icon: Video, top: '15%', left: '80%', delay: '0s', color: 'text-blue-400' },
          { Icon: Scissors, top: '70%', left: '85%', delay: '2s', color: 'text-purple-400' },
          { Icon: Volume2, top: '25%', left: '5%', delay: '4s', color: 'text-pink-400' },
          { Icon: Image, bottom: '20%', right: '5%', delay: '6s', color: 'text-green-400' },
        ].map((item, index) => (
          <div
            key={index}
            className="absolute opacity-60"
            style={{
              ...item,
              transform: `
                translate3d(${mousePosition.x * (0.01 + index * 0.005)}px, ${mousePosition.y * (0.01 + index * 0.005)}px, 0)
                rotateX(${mousePosition.y * 0.1}deg)
                rotateY(${mousePosition.x * 0.1}deg)
                scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.1})
              `,
              transition: 'transform 0.3s ease-out',
              animation: `float-icon-${index} ${8 + index * 2}s ease-in-out infinite ${item.delay}`
            }}
          >
            <item.Icon className={`w-12 h-12 ${item.color} drop-shadow-lg`} />
          </div>
        ))}

        {/* Particle System */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `
                translate3d(${mousePosition.x * (0.005 + i * 0.001)}px, ${mousePosition.y * (0.005 + i * 0.001)}px, 0)
              `,
              transition: 'transform 0.3s ease-out',
              animation: `particle-float-${i % 4} ${10 + i * 0.5}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* 3D Badge */}
          <div 
            className={`inline-flex items-center px-6 py-3 mb-8 rounded-full backdrop-blur-md border border-white/20 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.05}deg)
                rotateY(${mousePosition.x * 0.05}deg)
                translateZ(20px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Sparkles className="w-5 h-5 text-yellow-400 mr-3 animate-pulse" />
            <span className="text-white font-medium">AI-Powered Video Revolution</span>
            <Zap className="w-5 h-5 text-blue-400 ml-3 animate-bounce" />
          </div>

          {/* 3D Main Heading */}
          <h1 
            className={`text-6xl md:text-8xl font-bold mb-6 transition-all duration-1200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 25%, #ec4899 50%, #3b82f6 75%, #ffffff 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 4s ease-in-out infinite',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.5)',
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.02}deg)
                rotateY(${mousePosition.x * 0.02}deg)
                translateZ(30px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            Transform
            <br />
            <span className="relative">
              Your Videos
              <div 
                className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl rounded-full"
                style={{
                  animation: 'pulse-glow 3s ease-in-out infinite'
                }}
              />
            </span>
          </h1>

          {/* 3D Subtitle */}
          <p 
            className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.01}deg)
                rotateY(${mousePosition.x * 0.01}deg)
                translateZ(15px)
              `,
              transition: 'transform 0.3s ease-out',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            Experience the future of video editing with AI-powered automation, 
            real-time processing, and stunning visual enhancements that bring your content to life.
          </p>

          {/* 3D Action Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link 
              to="/editor" 
              className="group relative px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
                backgroundSize: '200% 200%',
                animation: 'gradient-flow 3s ease infinite',
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.03}deg)
                  rotateY(${mousePosition.x * 0.03}deg)
                  translateZ(25px)
                `,
                transition: 'all 0.3s ease-out',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.03}deg)
                  rotateY(${mousePosition.x * 0.03}deg)
                  translateZ(35px)
                  scale(1.05)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.03}deg)
                  rotateY(${mousePosition.x * 0.03}deg)
                  translateZ(25px)
                `;
              }}
            >
              <span className="relative z-10 flex items-center text-white">
                <Play size={24} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                Start Creating Magic
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-shimmer" />
            </Link>
            
            <button 
              className="group relative px-8 py-4 rounded-2xl font-semibold text-lg text-white border-2 border-white/30 backdrop-blur-md overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.02}deg)
                  rotateY(${mousePosition.x * 0.02}deg)
                  translateZ(20px)
                `,
                transition: 'all 0.3s ease-out',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.02}deg)
                  rotateY(${mousePosition.x * 0.02}deg)
                  translateZ(30px)
                  scale(1.05)
                `;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.02}deg)
                  rotateY(${mousePosition.x * 0.02}deg)
                  translateZ(20px)
                `;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                Watch Demo
              </span>
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
              </div>
            </button>
          </div>

          {/* 3D Stats */}
          <div 
            className={`flex justify-center items-center gap-12 mt-16 transition-all duration-1800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { value: '50K+', label: 'Videos Enhanced', delay: '0s' },
              { value: '99.9%', label: 'Accuracy Rate', delay: '0.2s' },
              { value: '10x', label: 'Faster Processing', delay: '0.4s' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{
                  transform: `
                    perspective(1000px)
                    rotateX(${mousePosition.y * 0.01}deg)
                    rotateY(${mousePosition.x * 0.01}deg)
                    translateZ(10px)
                  `,
                  transition: 'transform 0.3s ease-out',
                  animation: `stat-float ${3 + index}s ease-in-out infinite ${stat.delay}`
                }}
              >
                <div 
                  className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.5)',
                    background: 'linear-gradient(135deg, #ffffff, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{
          transform: `
            translateX(-50%)
            perspective(1000px)
            rotateX(${mousePosition.y * 0.05}deg)
            rotateY(${mousePosition.x * 0.05}deg)
            translateZ(10px)
          `,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>

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
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes stat-float {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-10px) rotateY(5deg); }
        }
        
        @keyframes float-icon-0 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-20px) rotateZ(180deg); }
        }
        
        @keyframes float-icon-1 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-15px) rotateZ(-180deg); }
        }
        
        @keyframes float-icon-2 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-25px) rotateZ(90deg); }
        }
        
        @keyframes float-icon-3 {
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
      `}</style>
    </section>
  );
};

export default Hero3D;