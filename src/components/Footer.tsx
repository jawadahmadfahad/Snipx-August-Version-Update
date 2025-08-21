import { Scissors, Github, Twitter, Youtube, Mail, ArrowUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer 
        id="footer"
        className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-12 px-4 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float top-10 right-10" />
          <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float-delayed bottom-10 left-10" />
          
          {/* Sparkle Elements */}
          <div className="absolute top-20 left-1/4 animate-sparkle">
            <Sparkles className="text-purple-400/30 w-4 h-4" />
          </div>
          <div className="absolute bottom-32 right-1/3 animate-sparkle-delayed">
            <Sparkles className="text-pink-400/30 w-3 h-3" />
          </div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6 group">
                <div className="relative">
                  <Scissors className="text-purple-400 mr-3 transform group-hover:rotate-12 transition-transform duration-300" size={28} />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Snip<span className="text-teal-400">X</span>
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your gateway to simplified video editing, subtitling, and summarization powered by cutting-edge AI technology.
              </p>
              
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Github, href: "#", color: "hover:text-gray-300" },
                  { icon: Youtube, href: "#", color: "hover:text-red-400" },
                  { icon: Mail, href: "#", color: "hover:text-green-400" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-white/10`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Features Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Features
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {[
                  'Voice Cutting',
                  'Urdu Subtitling', 
                  'Video Summarization',
                  'Thumbnail Generation',
                  'Audio Enhancement'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-purple-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Resources
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {[
                  'Documentation',
                  'Tutorials',
                  'API Reference',
                  'Community',
                  'Support'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-6 text-white relative">
                Company
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {[
                  'About Us',
                  'Careers',
                  'Blog',
                  'Privacy Policy',
                  'Terms of Service'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className={`border-t border-gray-700/50 mt-12 pt-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SnipX. All rights reserved. Made with ❤️ for creators worldwide.
              </p>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-50" />
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <ArrowUp size={20} className="group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </button>
      )}
    </>
  );
};

export default Footer;