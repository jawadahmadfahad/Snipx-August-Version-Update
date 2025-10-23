import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import VideoEditor from '../components/VideoEditor';

const Editor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen py-16 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.3s ease-out',
            animation: 'float 12s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          style={{
            top: '60%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            transition: 'transform 0.3s ease-out',
            animation: 'float-delayed 15s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          style={{
            top: '30%',
            right: '30%',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.3s ease-out',
            animation: 'pulse-slow 8s ease-in-out infinite'
          }}
        />

        {/* Sparkle Elements */}
        <div className="absolute top-20 left-1/4" style={{ animation: 'sparkle 3s ease-in-out infinite' }}>
          <Sparkles className="text-purple-400 w-6 h-6" />
        </div>
        <div className="absolute top-40 right-1/3" style={{ animation: 'sparkle-delayed 3.5s ease-in-out infinite' }}>
          <Sparkles className="text-pink-400 w-4 h-4" />
        </div>
        <div className="absolute bottom-32 left-1/3" style={{ animation: 'sparkle-slow 4s ease-in-out infinite' }}>
          <Sparkles className="text-blue-400 w-5 h-5" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Badge */}
          <div
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 mb-8 transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
            style={{
              animation: 'slide-in-left 0.8s ease-out'
            }}
          >
            <Sparkles className="w-5 h-5 text-purple-600 mr-3 animate-pulse" />
            <span className="text-purple-700 font-medium">Professional Video Editor</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #8b5cf6 25%, #ec4899 50%, #3b82f6 75%, #1f2937 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-text-flow 4s ease-in-out infinite',
              textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.02}deg)
                rotateY(${mousePosition.x * 0.02}deg)
                translateZ(30px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            AI-Powered Video Editor
          </h1>

          <p
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.01}deg)
                rotateY(${mousePosition.x * 0.01}deg)
                translateZ(15px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            Upload your video and let AI handle the magic - automated trimming, subtitles, and enhancement
          </p>
        </div>

        {/* Video Editor Component */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `
              perspective(1000px)
              rotateX(${mousePosition.y * 0.005}deg)
              rotateY(${mousePosition.x * 0.005}deg)
              translateZ(20px)
            `,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <VideoEditor />
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        @keyframes sparkle-delayed {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(-180deg); }
        }

        @keyframes sparkle-slow {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(90deg); }
        }

        @keyframes gradient-text-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes slide-in-left {
          0% {
            transform: translateX(-20px) rotateY(-5deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0px) rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default Editor;
