import { 
  Code2, 
  Database, 
  Server, 
  Cpu, 
  Cloud, 
  Lock,
  Layers,
  GitBranch,
  Workflow,
  Zap
} from 'lucide-react';

const Technologies = () => {
  const techStacks = [
    {
      category: "Frontend Technologies",
      items: [
        {
          icon: <Code2 className="text-blue-500" size={32} />,
          name: "React",
          description: "Component-based UI library for building interactive interfaces",
          features: ["Component Architecture", "Virtual DOM", "React Hooks", "Context API"]
        },
        {
          icon: <Layers className="text-purple-500" size={32} />,
          name: "Tailwind CSS",
          description: "Utility-first CSS framework for rapid UI development",
          features: ["Responsive Design", "Custom Components", "Dark Mode", "Animations"]
        }
      ]
    },
    {
      category: "Backend Technologies",
      items: [
        {
          icon: <Server className="text-green-500" size={32} />,
          name: "Flask",
          description: "Lightweight Python web framework for building APIs",
          features: ["RESTful APIs", "JWT Authentication", "Middleware Support", "Database Integration"]
        },
        {
          icon: <Database className="text-yellow-500" size={32} />,
          name: "MongoDB",
          description: "NoSQL database for flexible data storage",
          features: ["Document Storage", "Scalability", "Rich Queries", "Real-time Updates"]
        }
      ]
    },
    {
      category: "AI & Processing",
      items: [
        {
          icon: <Cpu className="text-red-500" size={32} />,
          name: "TensorFlow",
          description: "Machine learning framework for video processing",
          features: ["Video Analysis", "Speech Recognition", "Object Detection", "Scene Understanding"]
        },
        {
          icon: <Workflow className="text-indigo-500" size={32} />,
          name: "FFmpeg",
          description: "Multimedia framework for video manipulation",
          features: ["Video Cutting", "Format Conversion", "Stream Processing", "Audio Extraction"]
        }
      ]
    },
    {
      category: "Infrastructure",
      items: [
        {
          icon: <Cloud className="text-sky-500" size={32} />,
          name: "Cloud Services",
          description: "Scalable cloud infrastructure for video processing",
          features: ["Auto Scaling", "Load Balancing", "CDN Integration", "Storage Solutions"]
        },
        {
          icon: <Lock className="text-gray-500" size={32} />,
          name: "Security",
          description: "Comprehensive security measures for data protection",
          features: ["Encryption", "Access Control", "Secure Storage", "Compliance"]
        }
      ]
    },
    {
      category: "Development Tools",
      items: [
        {
          icon: <GitBranch className="text-orange-500" size={32} />,
          name: "Version Control",
          description: "Code management and collaboration tools",
          features: ["Git Workflow", "Code Review", "Branch Management", "CI/CD"]
        },
        {
          icon: <Zap className="text-yellow-500" size={32} />,
          name: "Development Tools",
          description: "Tools for efficient development workflow",
          features: ["Hot Reloading", "Debug Tools", "Testing Suite", "Code Quality"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Technology Stack</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the cutting-edge technologies powering SnipX's video processing capabilities
          </p>
        </div>

        {/* Technology Stacks */}
        <div className="space-y-16">
          {techStacks.map((stack, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{stack.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stack.items.map((tech, techIndex) => (
                  <div key={techIndex} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {tech.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{tech.name}</h3>
                        <p className="text-gray-600 mt-1">{tech.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {tech.features.map((feature, featureIndex) => (
                            <div 
                              key={featureIndex}
                              className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1"
                            >
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Technologies;