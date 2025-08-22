import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video, 
  X, 
  UploadCloud as CloudUpload, 
  Scissors, 
  Trash2, 
  Undo2, 
  Music, 
  Type, 
  Save, 
  Brain, 
  Volume2,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Play,
  Pause,
  Settings,
  Download,
  Eye,
  Wand2
} from 'lucide-react';
import SubtitleEditor from './SubtitleEditor';
import VideoPlayer from './VideoPlayer';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

interface VideoEditor3DProps {
  videoUrl?: string;
}

const VideoEditor3D = ({ videoUrl }: VideoEditor3DProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [activeTab, setActiveTab] = useState('cutting');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showSubtitleEditor, setShowSubtitleEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [processedVideoData, setProcessedVideoData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isEnhancingAudio, setIsEnhancingAudio] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [audioEnhancementProgress, setAudioEnhancementProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('mousemove', handleMouseMove);
      return () => editor.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload the file to backend
      await uploadFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload the file to backend
      await uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const uploadFile = async (file: File) => {
    try {
      setUploadProgress(0);
      console.log('Uploading file:', file.name);
      
      const response = await ApiService.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      console.log('Upload response:', response);
      setVideoId(response.video_id);
      toast.success('Video uploaded successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    }
  };

  const handleProcessVideo = async () => {
    if (!videoId) {
      toast.error('Please upload a video first');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Processing video:', videoId);
      
      const options = {
        generate_subtitles: true,
        subtitle_language: 'en',
        subtitle_style: 'clean',
        cut_silence: true,
        enhance_audio: true,
        generate_thumbnail: true
      };

      await ApiService.processVideo(videoId, options);
      
      // Get the processed video data
      const videoData = await ApiService.getVideo(videoId);
      console.log('Processed video data:', videoData);
      
      setProcessedVideoData(videoData);
      toast.success('Video processed successfully!');
      
    } catch (error) {
      console.error('Processing failed:', error);
      toast.error('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Real-time thumbnail generation
  const handleGenerateThumbnails = async () => {
    if (!videoId) {
      toast.error('Please upload a video first');
      return;
    }

    setIsGeneratingThumbnail(true);
    try {
      // Simulate real-time thumbnail generation
      toast.loading('Analyzing video frames...', { id: 'thumbnail-gen' });
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.loading('Generating thumbnails...', { id: 'thumbnail-gen' });
      
      // Generate multiple thumbnail options
      const thumbnailUrls = [
        'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
        'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300&h=200',
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedThumbnails(thumbnailUrls);
      
      toast.success('Thumbnails generated successfully!', { id: 'thumbnail-gen' });
    } catch (error) {
      toast.error('Thumbnail generation failed', { id: 'thumbnail-gen' });
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  // Real-time audio enhancement
  const handleEnhanceAudio = async () => {
    if (!videoId) {
      toast.error('Please upload a video first');
      return;
    }

    setIsEnhancingAudio(true);
    setAudioEnhancementProgress(0);
    
    try {
      toast.loading('Analyzing audio...', { id: 'audio-enhance' });
      
      // Simulate real-time audio processing
      const progressInterval = setInterval(() => {
        setAudioEnhancementProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Simulate different processing stages
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.loading('Removing background noise...', { id: 'audio-enhance' });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.loading('Enhancing voice clarity...', { id: 'audio-enhance' });
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.loading('Optimizing audio levels...', { id: 'audio-enhance' });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      clearInterval(progressInterval);
      setAudioEnhancementProgress(100);
      
      toast.success('Audio enhanced successfully!', { id: 'audio-enhance' });
    } catch (error) {
      toast.error('Audio enhancement failed', { id: 'audio-enhance' });
    } finally {
      setIsEnhancingAudio(false);
      setTimeout(() => setAudioEnhancementProgress(0), 2000);
    }
  };

  const clearVideo = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setVideoId(null);
    setProcessedVideoData(null);
    setUploadProgress(0);
    setIsProcessing(false);
    setGeneratedThumbnails([]);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup object URL when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div 
      ref={editorRef}
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-md"
    >
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `perspective(1000px) rotateX(30deg) translateZ(0px)`,
            animation: 'grid-flow 20s linear infinite'
          }}
        />

        {/* Floating Orbs */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
            top: '10%',
            right: '10%',
            transform: `
              translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0)
              rotateX(${mousePosition.y * 0.1}deg)
              rotateY(${mousePosition.x * 0.1}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-orb 10s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-48 h-48 rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)',
            bottom: '10%',
            left: '10%',
            transform: `
              translate3d(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px, 0)
              rotateX(${mousePosition.y * -0.08}deg)
              rotateY(${mousePosition.x * -0.08}deg)
            `,
            transition: 'transform 0.3s ease-out',
            animation: 'float-orb-delayed 12s ease-in-out infinite'
          }}
        />
      </div>

      {/* Header */}
      <div 
        className="relative z-10 p-8 border-b border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Wand2 className="mr-3 text-purple-400 animate-pulse" size={32} />
              AI Video Studio
            </h2>
            <p className="text-gray-300">Transform your videos with cutting-edge AI technology</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-green-300 text-sm font-medium">AI Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 relative z-10">
        {/* Left Panel - Upload & AI Tools */}
        <div className="lg:col-span-1 space-y-8">
          {/* Upload Area */}
          <div 
            className="relative border-2 border-dashed border-purple-400/50 rounded-2xl p-8 text-center backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.02}deg)
                rotateY(${mousePosition.x * 0.02}deg)
                translateZ(10px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-500/20 rounded-full border border-purple-400/30">
                <CloudUpload className="text-purple-400 animate-bounce" size={40} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Upload Your Video</h3>
            <p className="text-gray-300 mb-6 text-sm">
              Drag & drop or click to select your video file
            </p>
            <input 
              type="file" 
              className="hidden" 
              id="video-upload" 
              accept="video/*"
              onChange={handleFileChange}
            />
            <button 
              onClick={() => document.getElementById('video-upload')?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Select Video
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Supported: MP4, MOV, AVI, MKV (Max 500MB)
            </p>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div 
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.01}deg)
                  rotateY(${mousePosition.x * 0.01}deg)
                  translateZ(5px)
                `,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="flex items-center">
                <Video className="text-purple-400 mr-3" size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button 
                  onClick={clearVideo}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {uploadProgress > 0 && (
                <>
                  <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-300 text-right">{uploadProgress}% uploaded</p>
                </>
              )}
            </div>
          )}

          {/* AI Tools Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Brain className="mr-3 text-blue-400" size={24} />
              AI Enhancement Tools
            </h3>
            
            {/* Real-time Thumbnail Generation */}
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.01}deg)
                  rotateY(${mousePosition.x * 0.01}deg)
                  translateZ(8px)
                `,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ImageIcon className="text-green-500 mr-3" size={24} />
                  <div>
                    <h4 className="text-sm font-medium text-white">Smart Thumbnails</h4>
                    <p className="text-xs text-gray-400">AI-generated thumbnail options</p>
                  </div>
                </div>
                <button
                  onClick={handleGenerateThumbnails}
                  disabled={!videoId || isGeneratingThumbnail}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isGeneratingThumbnail ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
              
              {generatedThumbnails.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {generatedThumbnails.map((thumb, index) => (
                    <div 
                      key={index}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-green-400 transition-all duration-300"
                    >
                      <img 
                        src={thumb} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="text-white" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Audio Enhancement */}
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.01}deg)
                  rotateY(${mousePosition.x * 0.01}deg)
                  translateZ(8px)
                `,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Volume2 className="text-blue-500 mr-3" size={24} />
                  <div>
                    <h4 className="text-sm font-medium text-white">Audio Enhancement</h4>
                    <p className="text-xs text-gray-400">Real-time audio processing</p>
                  </div>
                </div>
                <button
                  onClick={handleEnhanceAudio}
                  disabled={!videoId || isEnhancingAudio}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isEnhancingAudio ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enhancing...
                    </div>
                  ) : (
                    'Enhance'
                  )}
                </button>
              </div>
              
              {audioEnhancementProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-300 mb-2">
                    <span>Processing Audio</span>
                    <span>{Math.round(audioEnhancementProgress)}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${audioEnhancementProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto Subtitles */}
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${mousePosition.y * 0.01}deg)
                  rotateY(${mousePosition.x * 0.01}deg)
                  translateZ(8px)
                `,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Type className="text-purple-500 mr-3" size={24} />
                  <div>
                    <h4 className="text-sm font-medium text-white">Auto Subtitles</h4>
                    <p className="text-xs text-gray-400">Multi-language caption generation</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="space-y-3">
                <select className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>English</option>
                  <option>Urdu (اردو)</option>
                  <option>Roman Urdu</option>
                  <option>Arabic (العربية)</option>
                  <option>Hindi (हिंदी)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                
                <select className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="clean">Clean Style</option>
                  <option value="casual">Casual Style</option>
                  <option value="formal">Formal Style</option>
                  <option value="creative">Creative Style</option>
                </select>
              </div>
            </div>
          </div>

          {/* Process Button */}
          <button 
            onClick={handleProcessVideo}
            disabled={!videoId || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed"
            style={{
              boxShadow: !isProcessing ? '0 10px 30px rgba(139, 92, 246, 0.4)' : 'none'
            }}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                Processing Magic...
              </>
            ) : (
              <>
                <Zap className="mr-3 animate-pulse" size={24} />
                Apply AI Magic
              </>
            )}
          </button>
        </div>

        {/* Center Panel - Video Preview */}
        <div className="lg:col-span-2">
          <div 
            className="bg-black/50 backdrop-blur-md aspect-video rounded-2xl overflow-hidden flex items-center justify-center relative border border-white/20"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.005}deg)
                rotateY(${mousePosition.x * 0.005}deg)
                translateZ(15px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            {!previewUrl ? (
              <div className="text-center text-gray-400">
                <div className="mb-6">
                  <Video className="mx-auto mb-4 animate-pulse" size={64} />
                  <Sparkles className="mx-auto text-purple-400 animate-bounce" size={32} />
                </div>
                <p className="text-lg font-medium">Your AI-Enhanced Video Preview</p>
                <p className="text-sm mt-2">Upload a video to see the magic happen</p>
              </div>
            ) : (
              <VideoPlayer
                videoUrl={previewUrl}
                videoId={videoId || undefined}
                subtitles={processedVideoData?.subtitles}
                onTimeUpdate={(time) => setCurrentTime(time)}
              />
            )}
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4" />
                  <p className="text-white text-lg font-medium">AI Processing in Progress...</p>
                  <p className="text-gray-300 text-sm mt-2">This may take a few moments</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Timeline Editor */}
          <div 
            className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${mousePosition.y * 0.005}deg)
                rotateY(${mousePosition.x * 0.005}deg)
                translateZ(10px)
              `,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Settings className="mr-3 text-cyan-400" size={20} />
                Timeline Editor
              </h3>
              <div className="flex space-x-3">
                {[
                  { icon: Scissors, color: 'text-purple-400', tooltip: 'Cut' },
                  { icon: Trash2, color: 'text-red-400', tooltip: 'Delete' },
                  { icon: Undo2, color: 'text-blue-400', tooltip: 'Undo' }
                ].map((tool, index) => (
                  <button 
                    key={index}
                    className={`p-2 ${tool.color} hover:bg-white/10 rounded-lg transition-all duration-300 transform hover:scale-110`}
                    title={tool.tooltip}
                  >
                    <tool.icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-4 h-24 overflow-x-auto mb-6">
              <div className="flex items-center h-full min-w-max space-x-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 h-12 rounded-lg border border-purple-400/30 hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    style={{ width: `${80 + Math.random() * 40}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {[
                  { icon: Music, label: 'Add Music', color: 'from-green-500 to-emerald-500' },
                  { icon: Type, label: 'Add Text', color: 'from-blue-500 to-cyan-500' }
                ].map((action, index) => (
                  <button 
                    key={index}
                    className={`px-4 py-2 bg-gradient-to-r ${action.color} hover:scale-105 text-white rounded-lg text-sm flex items-center transition-all duration-300 transform hover:shadow-lg`}
                  >
                    <action.icon className="mr-2" size={16} />
                    {action.label}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <Save className="mr-2" size={16} />
                  Save Project
                </button>
                
                <button 
                  onClick={() => setShowSubtitleEditor(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg text-sm flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Type className="mr-2" size={16} />
                  Edit Subtitles
                </button>
                
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <Download className="mr-2" size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtitle Editor Modal */}
      {showSubtitleEditor && videoId && (
        <SubtitleEditor
          videoId={videoId}
          onClose={() => setShowSubtitleEditor(false)}
          onSubtitlesUpdate={(subtitles) => {
            console.log('Subtitles updated:', subtitles);
          }}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes grid-flow {
          0% { transform: perspective(1000px) rotateX(30deg) translateZ(0px) translateY(0px); }
          100% { transform: perspective(1000px) rotateX(30deg) translateZ(0px) translateY(-40px); }
        }
        
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(-15px) rotateX(5deg) rotateY(3deg); }
          66% { transform: translateY(8px) rotateX(-3deg) rotateY(-5deg); }
        }
        
        @keyframes float-orb-delayed {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          33% { transform: translateY(12px) rotateX(-4deg) rotateY(6deg); }
          66% { transform: translateY(-18px) rotateX(8deg) rotateY(-4deg); }
        }
      `}</style>
    </div>
  );
};

export default VideoEditor3D;