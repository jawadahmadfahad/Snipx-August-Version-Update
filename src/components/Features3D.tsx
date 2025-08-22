import { 
  FilmIcon, 
  Type, 
  FileText, 
  Image, 
  Scissors, 
  Volume2, 
  FastForward, 
  Download, 
  Sparkles, 
  Zap,
  Brain,
  Wand2,
  Layers,
  Cpu,
  Eye,
  Palette
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

const features = [
  {
    icon: <Scissors className="text-purple-600" size={32} />,
    title: "AI-Powered Voice Cutting",
    description: "Intelligent silence detection and removal with advanced audio analysis. Our AI identifies natural speech patterns and removes unwanted pauses automatically.",
    color: "purple",
    gradient: "from-purple-500 to-indigo-600",
    details: ["Smart silence detection", "Filler word removal", "Natural flow preservation", "Batch processing"],
    demo: "Real-time audio waveform analysis"
  },
  {
    icon: <Type className="text-teal-600" size={32} />,
    title: "Multi-Language Subtitling",
    description: "Generate accurate subtitles in 50+ languages with AI-powered speech recognition. Support for Urdu, Arabic, and complex scripts with perfect timing.",
    color: "teal",
    gradient: "from-teal-500 to-cyan-600",
    details: ["50+ languages supported", "Complex script handling", "Auto-timing sync", "Style customization"],
    demo: "Live subtitle generation preview"
  },
  {
    icon: <FastForward className="text-orange-500" size={32} />,
    title: "Intelligent Summarization",
    description: "AI-driven content analysis creates engaging highlights and key moments. Perfect for long-form content transformation into digestible clips.",
    color: "orange",
    gradient: "from-orange-500 to-red-600",
    details: ["Key moment detection", "Highlight extraction", "Custom length control", "Engagement optimization"],
    demo: "Smart content analysis in action"
  },
  {
    icon: <Volume2 className="text-green-600" size={32} />,
    title: "Advanced Audio Enhancement",
    description: "Professional-grade audio processing with noise reduction, EQ, and dynamic range optimization. Transform poor audio into broadcast quality.",
    color: "green",
    gradient: "from-green-500 to-emerald-600",
    details: ["Noise reduction", "EQ optimization", "Dynamic range control", "Voice clarity boost"],
    demo: "Real-time audio enhancement"
  },
  {
    icon: <FilmIcon className="text-blue-600" size={32} />,
    title: "Video Stabilization & Enhancement",
    description: "Advanced stabilization algorithms and visual enhancement tools. Correct shaky footage and improve overall video quality automatically.",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    details: ["Motion stabilization", "Color correction", "Brightness optimization", "Contrast enhancement"],
    demo: "Before/after comparison viewer"
  },
  {
    icon: <Image className="text-red-500" size={32} />,
    title: "Smart Thumbnail Generation",
    description: "AI analyzes your video content to generate compelling thumbnails that maximize click-through rates. Multiple options with A/B testing insights.",
    color: "red",
    gradient: "from-red-500 to-pink-600",
    details: ["AI scene analysis", "Multiple variations", "Click-rate optimization", "Brand consistency"],
    demo: "Thumbnail generation preview"
  },
  {
    icon: <Brain className="text-indigo-600" size={32} />,
    title: "Content Intelligence",
    description: "Deep learning algorithms understand your content context, suggesting optimal edits, transitions, and enhancements for maximum impact.",
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600",
    details: ["Context understanding", "Smart suggestions", "Trend analysis", "Performance prediction"],
    demo: "AI recommendation engine"
  },
  {
    icon: <Wand2 className="text-pink-500" size={32} />,
    title: "One-Click Magic",
    description: "Combine multiple AI features into powerful presets. Transform raw footage into polished content with a single click using our magic modes.",
    color: "pink",
    gradient: "from-pink-500 to-rose-600",
    details: ["Preset combinations", "One-click processing", "Custom workflows", "Batch operations"],
    demo: "Magic transformation preview"
  }
];

const Features3D = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.feature-card-3d');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);
      return () => {
        section.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.1}px)`,
      }}
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `perspective(1000px) rotateX(45deg) translateZ(0px)`,
            animation: 'grid-drift 25s linear infinite'
          }}
        />

        {/* Floating 3D Shapes */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
            top: '10%',
            right: '10%',
            transform: `
              translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0)
              rotateX(${mousePosition.y * 0.1}deg)
              rotateY(${mousePosition.x * 0.1}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-orb 12s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
            bottom: '10%',
            left: '10%',
            transform: `
              translate3d(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px, 0)
              rotateX(${mousePosition.y * -0.08}deg)
              rotateY(${mousePosition.x * -0.08}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-orb-delayed 15s ease-in-out infinite'
          }}
        />

        {/* Tech Icons Floating */}
        {[Cpu, Layers, Eye, Palette].map((Icon, index) => (
          <div
            key={index}
            className="absolute opacity-30"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 20}%`,
              transform: `
                translate3d(${mousePosition.x * (0.01 + index * 0.003)}px, ${mousePosition.y * (0.01 + index * 0.003)}px, 0)
                rotateX(${mousePosition.y * 0.1}deg)
                rotateY(${mousePosition.x * 0.1}deg)
                rotateZ(${index * 45}deg)
              `,
              transition: 'transform 0.3s ease-out',
              animation: `tech-float-${index} ${8 + index * 2}s ease-in-out infinite`
            }}
          >
            <Icon className="w-16 h-16 text-purple-400" />
          </div>
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* 3D Header */}
        <div className="text-center mb-20">
          <div 
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 shadow-2xl"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.05}deg)
                rotateY(${mousePosition.x * 0.05}deg)
                translateZ(20px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Zap className="w-5 h-5 text-yellow-400 mr-3 animate-pulse" />
            <span className="text-white font-medium">Revolutionary AI Features</span>
            <Sparkles className="w-5 h-5 text-blue-400 ml-3 animate-bounce" />
          </div>
          
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 25%, #ec4899 50%, #3b82f6 75%, #ffffff 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-text-flow 4s ease-in-out infinite',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.02}deg)
                rotateY(${mousePosition.x * 0.02}deg)
                translateZ(30px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            Unleash AI
            <br />
            <span className="relative">
              Magic
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl rounded-full animate-pulse-glow" />
            </span>
          </h2>
          
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
            Experience the future of video editing with cutting-edge AI that transforms 
            your creative vision into stunning reality with unprecedented speed and precision.
          </p>
        </div>
        
        {/* 3D Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              data-index={index}
              className={`feature-card-3d group relative transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transform: visibleCards.includes(index) 
                  ? `
                    perspective(1000px)
                    rotateX(${activeCard === index ? -5 : 0}deg)
                    rotateY(${activeCard === index ? 5 : 0}deg)
                    translateZ(${activeCard === index ? 30 : 0}px)
                    scale(${activeCard === index ? 1.05 : 1})
                  `
                  : `
                    perspective(1000px)
                    rotateX(-10deg)
                    translateY(50px)
                    translateZ(-20px)
                  `
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {/* Card Container */}
              <div 
                className="relative h-full p-8 rounded-3xl backdrop-blur-md border border-white/20 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                  boxShadow: activeCard === index 
                    ? `0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)`
                    : `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Animated Background Gradient */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`}
                  style={{
                    animation: activeCard === index ? 'gradient-rotate 3s ease-in-out infinite' : 'none'
                  }}
                />

                {/* Icon Container with 3D Effect */}
                <div className="relative mb-6">
                  <div 
                    className={`relative p-4 rounded-2xl bg-gradient-to-br from-${feature.color}-50/20 to-${feature.color}-100/20 backdrop-blur-sm border border-${feature.color}-200/30 shadow-lg`}
                    style={{
                      transform: activeCard === index 
                        ? 'rotateY(15deg) rotateX(10deg) translateZ(20px)' 
                        : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div 
                      className="transform transition-all duration-300"
                      style={{
                        transform: activeCard === index ? 'scale(1.1) rotateZ(5deg)' : 'scale(1) rotateZ(0deg)'
                      }}
                    >
                      {feature.icon}
                    </div>
                    
                    {/* Icon Glow Effect */}
                    <div 
                      className={`absolute inset-0 bg-${feature.color}-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      style={{
                        transform: 'scale(1.5)',
                        animation: activeCard === index ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                      }}
                    />
                  </div>

                  {/* Floating Sparkles */}
                  <div 
                    className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300`}
                    style={{
                      animation: activeCard === index ? 'sparkle-dance 2s ease-in-out infinite' : 'none'
                    }}
                  >
                    <Sparkles className={`w-4 h-4 text-${feature.color}-400`} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 
                    className={`text-xl font-bold mb-4 text-white group-hover:text-${feature.color}-100 transition-colors duration-300`}
                    style={{
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed mb-6 text-sm">
                    {feature.description}
                  </p>

                  {/* Feature Details */}
                  <div className="space-y-2 mb-6">
                    {feature.details.map((detail, detailIndex) => (
                      <div 
                        key={detailIndex}
                        className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                        style={{
                          transform: activeCard === index ? `translateX(${detailIndex * 2}px)` : 'translateX(0px)',
                          transition: `transform 0.3s ease-out ${detailIndex * 50}ms`
                        }}
                      >
                        <div className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full mr-3 animate-pulse`} />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo Badge */}
                  <div 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${feature.color}-500/20 text-${feature.color}-300 border border-${feature.color}-400/30`}
                    style={{
                      transform: activeCard === index ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.3s ease-out'
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    {feature.demo}
                  </div>
                </div>

                {/* Interactive Hover Overlay */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`,
                    animation: activeCard === index ? 'shimmer-overlay 2s ease-in-out infinite' : 'none'
                  }}
                />

                {/* Border Glow */}
                <div 
                  className={`absolute inset-0 rounded-3xl border-2 border-${feature.color}-400/0 group-hover:border-${feature.color}-400/50 transition-all duration-300`}
                  style={{
                    boxShadow: activeCard === index ? `0 0 30px rgba(139, 92, 246, 0.3)` : 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 3D Call to Action */}
        <div 
          className="text-center mt-20"
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
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-10 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-md border border-white/20">
            <div className="flex items-center">
              <span className="text-xl font-semibold mr-4">Experience the Magic</span>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-90">
                <FastForward className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Animated Background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-gradient-flow" />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes grid-drift {
          0% { transform: perspective(1000px) rotateX(45deg) translateZ(0px) translateY(0px); }
          100% { transform: perspective(1000px) rotateX(45deg) translateZ(0px) translateY(-60px); }
        }
        
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(-20px) rotateX(10deg) rotateY(5deg); }
          66% { transform: translateY(10px) rotateX(-5deg) rotateY(-10deg); }
        }
        
        @keyframes float-orb-delayed {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(15px) rotateX(-8deg) rotateY(8deg); }
          66% { transform: translateY(-25px) rotateX(12deg) rotateY(-6deg); }
        }
        
        @keyframes gradient-text-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes sparkle-dance {
          0%, 100% { transform: translateY(0px) rotateZ(0deg) scale(1); }
          25% { transform: translateY(-5px) rotateZ(90deg) scale(1.2); }
          50% { transform: translateY(-8px) rotateZ(180deg) scale(0.8); }
          75% { transform: translateY(-3px) rotateZ(270deg) scale(1.1); }
        }
        
        @keyframes shimmer-overlay {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        @keyframes tech-float-0 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-30px) rotateZ(180deg); }
        }
        
        @keyframes tech-float-1 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-25px) rotateZ(-180deg); }
        }
        
        @keyframes tech-float-2 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-35px) rotateZ(90deg); }
        }
        
        @keyframes tech-float-3 {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          50% { transform: translateY(-28px) rotateZ(-90deg); }
        }
      `}</style>
    </section>
  );
};

export default Features3D;