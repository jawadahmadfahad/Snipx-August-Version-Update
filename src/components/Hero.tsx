import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Simplify Your <span className="text-purple-600">Video Editing</span> Experience
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Automated voice cutting, subtitling, and video summarization - all in one platform.
              Save time and create professional videos with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/editor" 
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors 
                         flex items-center justify-center gap-2 font-medium"
              >
                Try Editor Now
                <ArrowRight size={18} />
              </Link>
              <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-md 
                              hover:bg-purple-50 transition-colors font-medium">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Video editing interface" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <p className="text-sm font-medium text-purple-900">Processing Complete</p>
                </div>
                <p className="text-xs text-gray-600">
                  Video summarized and subtitled in Urdu. Ready to export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;