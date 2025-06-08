import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Scissors,
  Captions,
  Film,
  Wand2,
  Image as ImageIcon,
  UploadCloud, // Corrected import name
  Play,
  Video,
  Download,
  Loader2,
} from 'lucide-react';

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface ConsoleLog {
  timestamp: string;
  message: string;
}

interface ProgressState {
  visible: boolean;
  percentage: number;
  status: string;
}

const Features = () => {
  const [activeTab, setActiveTab] = useState<string>('audio');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { timestamp: new Date().toLocaleTimeString(), message: '[System] SnipX Video Editor API Ready' }
  ]);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState<boolean>(false);
  const [thumbnailFrames, setThumbnailFrames] = useState<string[]>([]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);

  // State for form inputs
  const [pauseThreshold, setPauseThreshold] = useState<number>(500);
  const [fillerWordsLevel, setFillerWordsLevel] = useState<string>('medium');
  const [subtitleLanguage, setSubtitleLanguage] = useState<string>('en');
  const [subtitleStyle, setSubtitleStyle] = useState<string>('clean');
  const [summaryLength, setSummaryLength] = useState<string>('medium');
  const [summaryFocus, setSummaryFocus] = useState<string>('balanced');
  const [stabilizationLevel, setStabilizationLevel] = useState<string>('medium');
  const [audioEnhancement, setAudioEnhancement] = useState<string>('full');
  const [brightnessLevel, setBrightnessLevel] = useState<number>(100);
  const [contrastLevel, setContrastLevel] = useState<number>(100);
  const [thumbnailStyle, setThumbnailStyle] = useState<string>('modern');
  const [thumbnailText, setThumbnailText] = useState<string>('');

  // State for progress bars
  const [audioProgress, setAudioProgress] = useState<ProgressState>({ visible: false, percentage: 0, status: '' });
  const [subtitlesProgress, setSubtitlesProgress] = useState<ProgressState>({ visible: false, percentage: 0, status: '' });
  const [summarizationProgress, setSummarizationProgress] = useState<ProgressState>({ visible: false, percentage: 0, status: '' });
  const [enhancementProgress, setEnhancementProgress] = useState<ProgressState>({ visible: false, percentage: 0, status: '' });
  const [thumbnailProgress, setThumbnailProgress] = useState<ProgressState>({ visible: false, percentage: 0, status: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Log to console function
  const logToConsole = useCallback((message: string) => {
    setConsoleLogs(prevLogs => [
      ...prevLogs,
      { timestamp: new Date().toLocaleTimeString(), message }
    ]);
  }, []);

  // Scroll console to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Simulate processing function
  const simulateProcessing = useCallback((
    setProgressState: React.Dispatch<React.SetStateAction<ProgressState>>,
    progressMessage: string,
    completionMessage: string,
    duration: number = 3000,
    onComplete?: () => void
  ) => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
    }

    setProgressState({ visible: true, percentage: 0, status: `0% - ${progressMessage}` });
    let progress = 0;
    const startTime = Date.now();

    processingIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      progress = Math.min(100, (elapsedTime / duration) * 100);

      setProgressState(prev => ({ ...prev, percentage: progress, status: `${Math.round(progress)}% - ${progressMessage}` }));

      if (progress >= 100) {
        if (processingIntervalRef.current) {
          clearInterval(processingIntervalRef.current);
          processingIntervalRef.current = null;
        }
        logToConsole(completionMessage);
        setProgressState(prev => ({ ...prev, status: completionMessage }));
        if (onComplete) onComplete();
      }
    }, 100); // Update interval
  }, [logToConsole]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      logToConsole(`File uploaded: ${file.name} (${formatFileSize(file.size)})`);

      // Reset generated thumbnail when new file is uploaded
      setGeneratedThumbnail(null);
      setThumbnailFrames([]); // Clear old frames
      setSelectedFrameIndex(null);

      // Simulate loading thumbnails if the tab is active
      if (activeTab === 'thumbnail') {
        simulateThumbnailFrameGeneration();
      }

      // Cleanup object URL on unmount or when file changes
      // This cleanup should happen when the component unmounts or videoSrc changes
      // Handled in a separate useEffect below
    }
  };

  // Effect for cleaning up Object URL
  useEffect(() => {
    const currentVideoSrc = videoSrc; // Capture the value
    return () => {
      if (currentVideoSrc) {
        URL.revokeObjectURL(currentVideoSrc);
        // console.log("Revoked Object URL:", currentVideoSrc); // For debugging
      }
    };
  }, [videoSrc]); // Depend on videoSrc


  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    logToConsole(`Switched to ${tabId.replace('-', ' ')} tab`);
    // If thumbnail tab is selected and we have a file, load thumbnails
    if (tabId === 'thumbnail' && selectedFile && thumbnailFrames.length === 0) {
      simulateThumbnailFrameGeneration();
    }
  };

  const simulateThumbnailFrameGeneration = () => {
    if (!selectedFile) return;
    setIsLoadingThumbnails(true);
    logToConsole('Simulating thumbnail frame extraction...');
    setTimeout(() => {
      const frames = Array.from({ length: 6 }, (_, i) => `https://via.placeholder.com/96x64.png?text=Frame+${i + 1}`);
      setThumbnailFrames(frames);
      setIsLoadingThumbnails(false);
      logToConsole('Thumbnail frames ready.');
    }, 1500); // Simulate network/processing delay
  };

  const handleProcessAudio = () => {
    if (!selectedFile) {
      alert('Please upload a video file first');
      return;
    }
    logToConsole(`Starting audio processing: Pause Threshold=${pauseThreshold}ms, Fillers=${fillerWordsLevel}`);
    simulateProcessing(
      setAudioProgress,
      'Processing audio: detecting filler words and pauses',
      'Audio processing completed successfully'
    );
  };

  const handleGenerateSubtitles = () => {
    if (!selectedFile) {
      alert('Please upload a video file first');
      return;
    }
    logToConsole(`Starting subtitle generation: Lang=${subtitleLanguage}, Style=${subtitleStyle}`);
    simulateProcessing(
      setSubtitlesProgress,
      'Generating subtitles: transcribing and timing text',
      'Subtitles generated successfully'
    );
  };

  const handleSummarizeVideo = () => {
    if (!selectedFile) {
      alert('Please upload a video file first');
      return;
    }
    logToConsole(`Starting video summarization: Length=${summaryLength}, Focus=${summaryFocus}`);
    setIsLoadingPreview(true);
    simulateProcessing(
      setSummarizationProgress,
      'Analyzing video content for summarization',
      'Video summarized successfully',
      3000,
      () => setIsLoadingPreview(false)
    );
  };

  const handleEnhanceVideo = () => {
    if (!selectedFile) {
      alert('Please upload a video file first');
      return;
    }
    logToConsole(`Starting video enhancement: Stabilize=${stabilizationLevel}, Audio=${audioEnhancement}, Bright=${brightnessLevel}%, Contrast=${contrastLevel}%`);
    setIsLoadingPreview(true);
    simulateProcessing(
      setEnhancementProgress,
      'Enhancing video quality with selected parameters',
      'Video enhancement completed successfully',
      3500,
      () => setIsLoadingPreview(false)
    );
  };

  const handleGenerateThumbnail = () => {
    if (!selectedFile) {
      alert('Please upload a video file first');
      return;
    }
    if (selectedFrameIndex === null) {
      alert('Please select a frame first');
      return;
    }
    logToConsole(`Starting thumbnail generation: Style=${thumbnailStyle}, Text="${thumbnailText}", Frame=${selectedFrameIndex + 1}`);
    setGeneratedThumbnail(null); // Clear previous
    simulateProcessing(
      setThumbnailProgress,
      'Generating final thumbnail from selected frame',
      'Thumbnail generated successfully',
      2500,
      () => {
        // Simulate getting the final thumbnail URL
        const generatedUrl = `https://via.placeholder.com/1280x720.png?text=Generated+Thumb+${selectedFrameIndex + 1}`;
        setGeneratedThumbnail(generatedUrl);
        logToConsole('Thumbnail preview ready');
      }
    );
  };

  const handleDownloadThumbnail = () => {
    if (!generatedThumbnail) return;
    logToConsole('Downloading thumbnail...');
    // In a real app, trigger download of the generatedThumbnail URL
    alert('In a real application, this would download the generated thumbnail');
  };

  const renderProgressBar = (progressState: ProgressState) => {
    if (!progressState.visible) return null;
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">{progressState.status.split('-')[1]?.trim() || 'Processing...'}</p>
        <div className="progress-bar bg-gray-200 rounded-full h-2">
          <div
            className="progress-fill bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progressState.percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-right">{Math.round(progressState.percentage)}%</p>
      </div>
    );
  };

  const tabs = [
    { id: 'audio', name: 'Audio Cutting', icon: Scissors },
    { id: 'subtitles', name: 'Subtitling', icon: Captions },
    { id: 'summarization', name: 'Summarization', icon: Film },
    { id: 'enhancement', name: 'Enhancement', icon: Wand2 },
    { id: 'thumbnail', name: 'Thumbnail', icon: ImageIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="editor-container p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Video Editor</h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`tab-button whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* File Upload Area */}
        <div
          id="file-upload-area"
          className="file-upload-area border-dashed border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 py-12 px-6 text-center cursor-pointer mb-6 rounded-lg transition-colors duration-200"
          onClick={triggerFileUpload}
        >
          <UploadCloud className="mx-auto text-4xl text-gray-400 mb-4" /> {/* Corrected icon usage */}
          <p className="text-gray-600 font-medium">Drag & drop your video file here or click to browse</p>
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <p className="text-sm text-gray-500 mt-2">Supports MP4, MOV, AVI up to 500MB</p>
        </div>
        {selectedFile && (
          <div id="filename-display" className="mb-6 text-sm text-gray-700 font-medium bg-gray-100 p-2 rounded text-center">
            Selected file: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </div>
        )}

        {/* Tab Contents */}
        <div className="mt-8">
          {/* Audio Cutting Tab */}
          <div id="audio-tab" className={`tab-content ${activeTab === 'audio' ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Audio Cutting Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pause-threshold" className="block text-sm font-medium text-gray-700 mb-1">Remove Pauses Longer Than</label>
                <div className="flex items-center">
                  <input type="range" id="pause-threshold" min="0" max="2000" value={pauseThreshold} onChange={(e) => setPauseThreshold(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  <span id="pause-value" className="ml-3 text-sm text-gray-600 w-16 text-right">{pauseThreshold}ms</span>
                </div>
              </div>
              <div>
                <label htmlFor="filler-words-level" className="block text-sm font-medium text-gray-700 mb-1">Filler Words Detection Sensitivity</label>
                <select id="filler-words-level" value={fillerWordsLevel} onChange={(e) => setFillerWordsLevel(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="high">High (Removes all filler words)</option>
                  <option value="medium">Medium (Removes common fillers)</option>
                  <option value="low">Low (Only removes excessive fillers)</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleProcessAudio} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFile}>
                <Play className="mr-2 h-4 w-4" />Process Audio
              </button>
            </div>
            {renderProgressBar(audioProgress)}
          </div>

          {/* Subtitling Tab */}
          <div id="subtitles-tab" className={`tab-content ${activeTab === 'subtitles' ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Subtitling Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subtitle-language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select id="subtitle-language" value={subtitleLanguage} onChange={(e) => setSubtitleLanguage(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                  <option value="ru-ur">Roman Urdu</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label htmlFor="subtitle-style" className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select id="subtitle-style" value={subtitleStyle} onChange={(e) => setSubtitleStyle(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="clean">Clean</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="bold">Bold</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleGenerateSubtitles} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFile}>
                <Captions className="mr-2 h-4 w-4" />Generate Subtitles
              </button>
            </div>
            {renderProgressBar(subtitlesProgress)}
          </div>

          {/* Summarization Tab */}
          <div id="summarization-tab" className={`tab-content ${activeTab === 'summarization' ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Summarization</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="summary-length" className="block text-sm font-medium text-gray-700 mb-1">Summary Length</label>
                    <select id="summary-length" value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="short">Short (~20% of original)</option>
                        <option value="medium">Medium (~40% of original)</option>
                        <option value="long">Long (~60% of original)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="summary-focus" className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                    <select id="summary-focus" value={summaryFocus} onChange={(e) => setSummaryFocus(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="balanced">Balanced</option>
                        <option value="visual">Visual Content</option>
                        <option value="audio">Audio Content</option>
                        <option value="text">Spoken Text</option>
                    </select>
                </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSummarizeVideo} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFile}>
                <Film className="mr-2 h-4 w-4" />Summarize Video
              </button>
            </div>
            {renderProgressBar(summarizationProgress)}
          </div>

          {/* Enhancement Tab */}
          <div id="enhancement-tab" className={`tab-content ${activeTab === 'enhancement' ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Enhancement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="stabilization-level" className="block text-sm font-medium text-gray-700 mb-1">Stabilization</label>
                    <select id="stabilization-level" value={stabilizationLevel} onChange={(e) => setStabilizationLevel(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="audio-enhancement" className="block text-sm font-medium text-gray-700 mb-1">Audio Enhancement</label>
                    <select id="audio-enhancement" value={audioEnhancement} onChange={(e) => setAudioEnhancement(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="none">None</option>
                        <option value="clear">Clear Speech</option>
                        <option value="music">Music Enhancement</option>
                        <option value="full">Full Enhancement</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="brightness-level" className="block text-sm font-medium text-gray-700 mb-1">Brightness</label>
                    <div className="flex items-center">
                        <input type="range" id="brightness-level" min="0" max="200" value={brightnessLevel} onChange={(e) => setBrightnessLevel(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                        <span id="brightness-value" className="ml-3 text-sm text-gray-600 w-16 text-right">{brightnessLevel}%</span>
                    </div>
                </div>
                <div>
                    <label htmlFor="contrast-level" className="block text-sm font-medium text-gray-700 mb-1">Contrast</label>
                    <div className="flex items-center">
                        <input type="range" id="contrast-level" min="0" max="200" value={contrastLevel} onChange={(e) => setContrastLevel(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                        <span id="contrast-value" className="ml-3 text-sm text-gray-600 w-16 text-right">{contrastLevel}%</span>
                    </div>
                </div>
            </div>
            <div className="mt-6">
              <button onClick={handleEnhanceVideo} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFile}>
                <Wand2 className="mr-2 h-4 w-4" />Enhance Video
              </button>
            </div>
            {renderProgressBar(enhancementProgress)}
          </div>

          {/* Thumbnail Tab */}
          <div id="thumbnail-tab" className={`tab-content ${activeTab === 'thumbnail' ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Thumbnail Generation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="thumbnail-style" className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                    <select id="thumbnail-style" value={thumbnailStyle} onChange={(e) => setThumbnailStyle(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="minimal">Minimal</option>
                        <option value="modern">Modern</option>
                        <option value="bold">Bold</option>
                        <option value="elegant">Elegant</option>
                        <option value="vibrant">Vibrant</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="thumbnail-text" className="block text-sm font-medium text-gray-700 mb-1">Add Text Overlay</label>
                    <input type="text" id="thumbnail-text" value={thumbnailText} onChange={(e) => setThumbnailText(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter text for thumbnail" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Frame</label>
                    <div className="flex space-x-4 overflow-x-auto py-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                        {isLoadingThumbnails ? (
                            <div className="flex items-center justify-center w-full h-16 text-gray-500">
                                <Loader2 className="animate-spin mr-2 h-5 w-5" /> Loading frames...
                            </div>
                        ) : thumbnailFrames.length > 0 ? (
                            thumbnailFrames.map((frameSrc, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedFrameIndex(index);
                                        logToConsole(`Selected frame ${index + 1} for thumbnail generation`);
                                    }}
                                    className={`w-24 h-16 bg-gray-200 rounded cursor-pointer ring-offset-2 ring-offset-gray-50 hover:ring-2 hover:ring-indigo-500 flex-shrink-0 overflow-hidden transition-all duration-150 ${selectedFrameIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
                                >
                                    <img src={frameSrc} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-16 flex items-center justify-center text-gray-400 text-sm">
                                {selectedFile ? 'No frames generated yet.' : 'Upload a video to generate frames.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6">
              <button onClick={handleGenerateThumbnail} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedFile || selectedFrameIndex === null}>
                <ImageIcon className="mr-2 h-4 w-4" />Generate Thumbnail
              </button>
            </div>
            {renderProgressBar(thumbnailProgress)}
            {generatedThumbnail && (
              <div id="thumbnail-result" className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Generated Thumbnail</h4>
                  <div className="w-full max-w-md bg-gray-100 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                      <img id="generated-thumbnail" src={generatedThumbnail} alt="Generated Thumbnail" className="w-full h-auto block" />
                  </div>
                  <div className="mt-4">
                      <button onClick={handleDownloadThumbnail} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center">
                          <Download className="mr-2 h-4 w-4" />Download Thumbnail
                      </button>
                  </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Preview Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="video-preview flex items-center justify-center bg-gray-800 relative rounded-lg overflow-hidden shadow-inner aspect-video">
            {!videoSrc ? (
              <div id="video-placeholder" className="text-gray-400 text-center p-8">
                <Video className="mx-auto text-5xl mb-4" />
                <p>Upload a video to see preview</p>
              </div>
            ) : (
              <video id="video-player" controls src={videoSrc} className="w-full h-full block bg-black"></video>
            )}
            {isLoadingPreview && (
              <div id="preview-loading" className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="animate-spin h-12 w-12 text-indigo-400" />
              </div>
            )}
          </div>
        </div>

        {/* API Console */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">API Console</h3>
          <div id="api-console" ref={consoleRef} className="api-console text-sm bg-gray-900 text-green-400 font-mono p-4 rounded-lg h-48 overflow-y-auto border border-gray-700 scroll-smooth">
            {consoleLogs.map((log, index) => (
              <div key={index} className="console-line whitespace-pre-wrap break-words mb-1 last:mb-0">
                <span className="text-gray-500 mr-2 select-none">{log.timestamp}</span>
                <span className={log.message.startsWith('[System]') ? 'text-blue-400' : ''}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
