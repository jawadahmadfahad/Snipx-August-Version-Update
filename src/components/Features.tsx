import { FilmIcon, Type, FileText, Image, Scissors, Volume2, FastForward, Download } from 'lucide-react';

const features = [
  {
    icon: <Scissors className="text-purple-600" size={32} />,
    title: "Automated Voice Cutting",
    description: "Automatically detect and remove silences, stutters, and filler words to create polished audio."
  },
  {
    icon: <Type className="text-teal-600" size={32} />,
    title: "Urdu Subtitling",
    description: "Generate accurate Urdu subtitles automatically. Edit and style them to match your preferences."
  },
  {
    icon: <FastForward className="text-orange-500" size={32} />,
    title: "Video Summarization",
    description: "Create concise summaries of long videos to improve engagement and save viewers' time."
  },
  {
    icon: <Volume2 className="text-green-600" size={32} />,
    title: "Audio Enhancement",
    description: "Improve audio quality with noise reduction, equalization, and volume normalization."
  },
  {
    icon: <FilmIcon className="text-blue-600" size={32} />,
    title: "Visual Enhancement",
    description: "Stabilize shaky footage, adjust colors, and improve overall visual quality."
  },
  {
    icon: <Image className="text-red-500" size={32} />,
    title: "Thumbnail Generation",
    description: "Create eye-catching thumbnails to attract more viewers to your content."
  },
  {
    icon: <FileText className="text-indigo-600" size={32} />,
    title: "Multi-format Support",
    description: "Import and export videos in various formats to suit your specific needs."
  },
  {
    icon: <Download className="text-gray-700" size={32} />,
    title: "Easy Export",
    description: "Export your enhanced videos in multiple quality settings for different platforms."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how SnipX can transform your video editing workflow and help you create
            professional content with minimal effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300
                        border border-gray-100 flex flex-col"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;