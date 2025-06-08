import { Upload, Scissors, Type, FastForward, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="text-purple-600" size={32} />,
    title: "Upload Your Video",
    description: "Upload your video file to SnipX. We support various formats including MP4, MOV, AVI, and more."
  },
  {
    icon: <Scissors className="text-teal-600" size={32} />,
    title: "Automated Processing",
    description: "Our AI analyzes your video, detects silences and filler words, and prepares it for enhancement."
  },
  {
    icon: <Type className="text-blue-600" size={32} />,
    title: "Add Subtitles",
    description: "Automatically generate Urdu subtitles for your video and customize their appearance."
  },
  {
    icon: <FastForward className="text-orange-500" size={32} />,
    title: "Summarize Content",
    description: "Create a concise summary of your video to highlight the most important parts."
  },
  {
    icon: <Download className="text-green-600" size={32} />,
    title: "Export & Share",
    description: "Export your enhanced video in various formats and share it with your audience."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-purple-50 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How SnipX Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience a simple and intuitive workflow designed to streamline your video editing process.
          </p>
        </div>
        
        <div className="relative">
          {/* Process Steps */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center relative"
              >
                <div className="bg-white rounded-full p-4 shadow-md mb-4 relative">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 -right-4 z-20 text-gray-400">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;