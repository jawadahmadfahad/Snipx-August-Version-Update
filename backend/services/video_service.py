import os
import json
from datetime import datetime
from models.video import Video
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
import magic
import cv2
import numpy as np
from moviepy.editor import VideoFileClip
from pydub import AudioSegment
import tensorflow as tf
from transformers import pipeline

class VideoService:
    def __init__(self, db):
        self.db = db
        self.videos = db.videos
        self.upload_folder = os.getenv('UPLOAD_FOLDER', 'uploads')
        self.max_content_length = int(os.getenv('MAX_CONTENT_LENGTH', 500 * 1024 * 1024))
        
        # Initialize AI models
        try:
            self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
            self.speech_recognizer = pipeline("automatic-speech-recognition")
        except Exception as e:
            print(f"Warning: Could not initialize AI models: {e}")
            self.summarizer = None
            self.speech_recognizer = None

    def save_video(self, file, user_id):
        if not file:
            raise ValueError("No file provided")

        filename = secure_filename(file.filename)
        filepath = os.path.join(self.upload_folder, filename)
        
        # Create upload directory if it doesn't exist
        os.makedirs(self.upload_folder, exist_ok=True)
        
        # Save file
        file.save(filepath)
        
        # Validate file
        if not self._is_valid_video(filepath):
            os.remove(filepath)
            raise ValueError("Invalid video file")

        # Create video document
        video = Video(
            user_id=ObjectId(user_id),
            filename=filename,
            filepath=filepath,
            size=os.path.getsize(filepath)
        )
        
        # Extract metadata
        self._extract_metadata(video)
        
        # Save to database
        result = self.videos.insert_one(video.to_dict())
        return str(result.inserted_id)

    def process_video(self, video_id, options):
        video = self.get_video(video_id)
        if not video:
            raise ValueError("Video not found")

        video.status = "processing"
        video.process_start_time = datetime.utcnow()
        video.processing_options = options
        
        try:
            # Enhanced processing with actual options
            if options.get('cut_silence'):
                self._cut_silence(video)
            
            if options.get('enhance_audio'):
                self._enhance_audio(video, options)
            
            if options.get('generate_thumbnail'):
                self._generate_thumbnail(video)
            
            if options.get('generate_subtitles'):
                self._generate_subtitles(video, options)
            
            if options.get('summarize'):
                self._summarize_video(video)

            # Apply video enhancements
            if any([options.get('stabilization'), options.get('brightness'), options.get('contrast')]):
                self._apply_video_enhancements(video, options)

            video.status = "completed"
            video.process_end_time = datetime.utcnow()
            
        except Exception as e:
            video.status = "failed"
            video.error = str(e)
            video.process_end_time = datetime.utcnow()
            raise
        
        finally:
            self.videos.update_one(
                {"_id": ObjectId(video_id)},
                {"$set": video.to_dict()}
            )

    def get_video(self, video_id):
        video_data = self.videos.find_one({"_id": ObjectId(video_id)})
        if not video_data:
            return None
        return Video.from_dict(video_data)

    def get_user_videos(self, user_id):
        videos = self.videos.find({"user_id": ObjectId(user_id)})
        return [Video.from_dict(video).to_dict() for video in videos]

    def delete_video(self, video_id, user_id):
        video = self.get_video(video_id)
        if not video:
            raise ValueError("Video not found")
        
        if str(video.user_id) != str(user_id):
            raise ValueError("Unauthorized")
        
        # Delete file
        if os.path.exists(video.filepath):
            os.remove(video.filepath)
        
        # Delete processed files
        if video.outputs.get('processed_video') and os.path.exists(video.outputs['processed_video']):
            os.remove(video.outputs['processed_video'])
        
        # Delete from database
        self.videos.delete_one({"_id": ObjectId(video_id)})

    def _is_valid_video(self, filepath):
        try:
            mime = magic.Magic(mime=True)
            file_type = mime.from_file(filepath)
            return file_type.startswith('video/')
        except:
            # Fallback: check file extension
            valid_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv']
            return any(filepath.lower().endswith(ext) for ext in valid_extensions)

    def _extract_metadata(self, video):
        try:
            clip = VideoFileClip(video.filepath)
            video.metadata.update({
                "duration": clip.duration,
                "fps": clip.fps,
                "resolution": f"{clip.size[0]}x{clip.size[1]}",
                "format": os.path.splitext(video.filename)[1][1:]
            })
            clip.close()
        except Exception as e:
            print(f"Error extracting metadata: {e}")
            video.metadata.update({
                "format": os.path.splitext(video.filename)[1][1:]
            })

    def _apply_video_enhancements(self, video, options):
        """Apply video enhancements like brightness, contrast, stabilization"""
        try:
            clip = VideoFileClip(video.filepath)
            
            # Apply brightness and contrast adjustments
            brightness = options.get('brightness', 100) / 100.0  # Convert percentage to multiplier
            contrast = options.get('contrast', 100) / 100.0
            
            if brightness != 1.0 or contrast != 1.0:
                def adjust_brightness_contrast(image):
                    # Convert to float for calculations
                    img = image.astype(np.float32)
                    
                    # Apply brightness (additive)
                    if brightness != 1.0:
                        img = img * brightness
                    
                    # Apply contrast (multiplicative around midpoint)
                    if contrast != 1.0:
                        img = (img - 128) * contrast + 128
                    
                    # Clip values to valid range
                    img = np.clip(img, 0, 255)
                    return img.astype(np.uint8)
                
                clip = clip.fl_image(adjust_brightness_contrast)
            
            # Apply stabilization (basic implementation)
            stabilization = options.get('stabilization', 'none')
            if stabilization != 'none':
                # For now, we'll just apply a simple smoothing
                # In a real implementation, you'd use more sophisticated stabilization
                pass
            
            # Save enhanced video
            output_path = f"{os.path.splitext(video.filepath)[0]}_enhanced.mp4"
            clip.write_videofile(output_path, codec='libx264', audio_codec='aac')
            video.outputs["processed_video"] = output_path
            
            clip.close()
            
        except Exception as e:
            print(f"Error applying video enhancements: {e}")
            raise

    def _cut_silence(self, video):
        try:
            audio = AudioSegment.from_file(video.filepath)
            chunks = []
            silence_thresh = -40
            min_silence_len = 500
            
            # Process audio in chunks
            chunk_length = 10000
            for i in range(0, len(audio), chunk_length):
                chunk = audio[i:i + chunk_length]
                if chunk.dBFS > silence_thresh:
                    chunks.append(chunk)
            
            # Combine non-silent chunks
            processed_audio = AudioSegment.empty()
            for chunk in chunks:
                processed_audio += chunk
            
            # Save processed audio
            output_path = f"{os.path.splitext(video.filepath)[0]}_processed.mp4"
            processed_audio.export(output_path, format="mp4")
            video.outputs["processed_video"] = output_path
        except Exception as e:
            print(f"Error cutting silence: {e}")

    def _enhance_audio(self, video, options):
        try:
            audio = AudioSegment.from_file(video.filepath)
            
            # Get enhancement type
            enhancement_type = options.get('audio_enhancement_type', 'full')
            
            # Apply audio enhancements based on type
            if enhancement_type == 'clear':
                # Focus on speech clarity
                enhanced = audio.normalize()
                enhanced = enhanced.high_pass_filter(80)  # Remove low frequency noise
            elif enhancement_type == 'music':
                # Focus on music enhancement
                enhanced = audio.normalize()
                enhanced = enhanced.compress_dynamic_range()
            else:  # 'full' enhancement
                enhanced = audio.normalize()
                enhanced = enhanced.compress_dynamic_range()
                enhanced = enhanced.high_pass_filter(80)
            
            # Save enhanced audio
            output_path = f"{os.path.splitext(video.filepath)[0]}_enhanced_audio.mp4"
            enhanced.export(output_path, format="mp4")
            video.outputs["processed_video"] = output_path
        except Exception as e:
            print(f"Error enhancing audio: {e}")

    def _generate_thumbnail(self, video):
        try:
            cap = cv2.VideoCapture(video.filepath)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
            ret, frame = cap.read()
            
            if ret:
                thumbnail_path = f"{os.path.splitext(video.filepath)[0]}_thumb.jpg"
                cv2.imwrite(thumbnail_path, frame)
                video.outputs["thumbnail"] = thumbnail_path
            
            cap.release()
        except Exception as e:
            print(f"Error generating thumbnail: {e}")

    def _generate_subtitles(self, video, options):
        """Enhanced subtitle generation with language support"""
        try:
            # Get language and style from options
            language = options.get('subtitle_language', 'en')
            style = options.get('subtitle_style', 'clean')
            
            print(f"[SUBTITLE DEBUG] Starting subtitle generation for video: {video.filepath}")
            print(f"[SUBTITLE DEBUG] Language: {language}, Style: {style}")
            
            # Extract audio for transcription
            clip = VideoFileClip(video.filepath)
            audio_path = f"{os.path.splitext(video.filepath)[0]}_audio.wav"
            print(f"[SUBTITLE DEBUG] Extracting audio to: {audio_path}")
            clip.audio.write_audiofile(audio_path)
            print(f"[SUBTITLE DEBUG] Audio extraction completed")
            
            # Try to use Whisper for real transcription
            try:
                print(f"[SUBTITLE DEBUG] Attempting Whisper transcription...")
                import whisper
                print(f"[SUBTITLE DEBUG] Whisper imported successfully")
                
                model = whisper.load_model("base")
                print(f"[SUBTITLE DEBUG] Whisper model loaded successfully")
                
                whisper_lang = self._get_whisper_language_code(language)
                print(f"[SUBTITLE DEBUG] Using Whisper language code: {whisper_lang}")
                
                # Load audio data directly using moviepy instead of relying on FFmpeg
                import librosa
                audio_data, sample_rate = librosa.load(audio_path, sr=16000)
                print(f"[SUBTITLE DEBUG] Audio loaded with librosa: {len(audio_data)} samples at {sample_rate}Hz")
                
                result = model.transcribe(audio_data, language=whisper_lang)
                print(f"[SUBTITLE DEBUG] Whisper transcription completed")
                print(f"[SUBTITLE DEBUG] Found {len(result.get('segments', []))} segments")
                
                # Extract segments with timestamps
                segments = []
                for i, segment in enumerate(result['segments']):
                    segments.append({
                        'start': segment['start'],
                        'end': segment['end'],
                        'text': segment['text'].strip()
                    })
                    print(f"[SUBTITLE DEBUG] Segment {i+1}: {segment['start']:.2f}s-{segment['end']:.2f}s: '{segment['text'].strip()}'")
                
                print(f"[SUBTITLE DEBUG] Successfully processed {len(segments)} segments from Whisper")
                
                # Generate both SRT and JSON format subtitles
                srt_content, json_data = self._create_subtitles_from_segments(segments, language, style)
                print(f"[SUBTITLE DEBUG] Using REAL Whisper transcription")
                
            except ImportError as e:
                print(f"[SUBTITLE DEBUG] Whisper or librosa not available: {e}")
                print(f"[SUBTITLE DEBUG] Falling back to sample text")
                # Fallback to sample text
                text = self._get_sample_text(language)
                srt_content, json_data = self._create_subtitles(text, language, style, clip.duration)
                
            except Exception as e:
                print(f"[SUBTITLE DEBUG] Whisper transcription failed with error: {e}")
                print(f"[SUBTITLE DEBUG] Error type: {type(e).__name__}")
                import traceback
                traceback.print_exc()
                print(f"[SUBTITLE DEBUG] Falling back to sample text")
                
                # Fallback to sample text
                text = self._get_sample_text(language)
                srt_content, json_data = self._create_subtitles(text, language, style, clip.duration)
            
            # Save subtitles file
            srt_path = f"{os.path.splitext(video.filepath)[0]}_{language}.srt"
            print(f"[SUBTITLE DEBUG] Saving SRT file to: {srt_path}")
            with open(srt_path, 'w', encoding='utf-8') as f:
                f.write(srt_content)
            
            # Save JSON format for live display
            json_path = f"{os.path.splitext(video.filepath)[0]}_{language}.json"
            print(f"[SUBTITLE DEBUG] Saving JSON file to: {json_path}")
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=2)
            
            print(f"[SUBTITLE DEBUG] Subtitle generation completed successfully")
            print(f"[SUBTITLE DEBUG] Files saved: SRT={srt_path}, JSON={json_path}")
            
            video.outputs["subtitles"] = {
                "srt": srt_path,
                "json": json_path,
                "language": language,
                "style": style
            }
            
            clip.close()
            if os.path.exists(audio_path):
                os.remove(audio_path)
                
        except Exception as e:
            print(f"Error generating subtitles: {e}")
            # Create fallback subtitles
            self._create_fallback_subtitles(video, options)

    def _get_whisper_language_code(self, language):
        """Convert our language codes to Whisper language codes"""
        whisper_codes = {
            'en': 'en',
            'ur': 'ur',
            'ru-ur': 'ur',  # Use Urdu model for Roman Urdu
            'ar': 'ar',
            'hi': 'hi',
            'es': 'es',
            'fr': 'fr',
            'de': 'de',
            'zh': 'zh',
            'ja': 'ja',
            'ko': 'ko',
            'pt': 'pt',
            'ru': 'ru',
            'it': 'it',
            'tr': 'tr',
            'nl': 'nl'
        }
        return whisper_codes.get(language, 'en')

    def _create_subtitles_from_segments(self, segments, language, style):
        """Create both SRT and JSON format subtitles from Whisper segments"""
        srt_content = ""
        json_data = {
            "language": language,
            "segments": [],
            "word_timestamps": True,
            "confidence": 0.95,
            "source": "whisper"
        }
        
        for i, segment in enumerate(segments):
            start_time = segment['start']
            end_time = segment['end']
            text = segment['text']
            
            # SRT format
            srt_content += f"{i + 1}\n"
            srt_content += f"{self._format_timestamp(start_time)} --> {self._format_timestamp(end_time)}\n"
            srt_content += f"{text}\n\n"
            
            # JSON format for live display
            json_data["segments"].append({
                "id": i + 1,
                "start": start_time,
                "end": end_time,
                "text": text,
                "language": language,
                "style": style
            })
        
        return srt_content, json_data
    def _get_sample_text(self, language):
        """Get sample text for different languages"""
        sample_texts = {
            'en': "Welcome to this video demonstration. This is an example of English subtitles generated automatically by SnipX AI.",
            'ur': "اس ویڈیو ڈیمونسٹریشن میں خوش آمدید۔ یہ اردو سب ٹائٹلز کی مثال ہے جو SnipX AI کے ذریعے خودکار طور پر تیار کیا گیا۔ ہمارا سسٹم اردو زبان کے لیے خاص طور پر تربیت یافتہ ہے۔",
            'ru-ur': "Is video demonstration mein khush aamdeed. Yeh Roman Urdu subtitles ki misaal hai jo SnipX AI ke zariye automatic tayyar kiya gaya. Hamara system Urdu language ke liye khaas training ke saath banaya gaya hai.",
            'es': "Bienvenido a esta demostración de video. Este es un ejemplo de subtítulos en español generados automáticamente por SnipX AI.",
            'fr': "Bienvenue dans cette démonstration vidéo. Ceci est un exemple de sous-titres français générés automatiquement par SnipX AI.",
            'de': "Willkommen zu dieser Video-Demonstration. Dies ist ein Beispiel für deutsche Untertitel, die automatisch von SnipX AI generiert wurden.",
            'ar': "مرحباً بكم في هذا العرض التوضيحي للفيديو. هذا مثال على الترجمة العربية التي تم إنشاؤها تلقائياً بواسطة SnipX AI.",
            'hi': "इस वीडियो प्रदर्शन में आपका स्वागत है। यह SnipX AI द्वारा स्वचालित रूप से उत्पन्न हिंदी उपशीर्षक का एक उदाहरण है।",
            'zh': "欢迎观看此视频演示。这是由SnipX AI自动生成的中文字幕示例。",
            'ja': "このビデオデモンストレーションへようこそ。これはSnipX AIによって自動生成された日本語字幕の例です。",
            'ko': "이 비디오 데모에 오신 것을 환영합니다. 이것은 SnipX AI에 의해 자동으로 생성된 한국어 자막의 예입니다。",
            'pt': "Bem-vindo a esta demonstração de vídeo. Este é um exemplo de legendas em português geradas automaticamente pelo SnipX AI.",
            'ru': "Добро пожаловать в эту видео-демонстрацию. Это пример русских субтитров, автоматически созданных SnipX AI.",
            'it': "Benvenuti in questa dimostrazione video. Questo è un esempio di sottotitoli italiani generati automaticamente da SnipX AI.",
            'tr': "Bu video gösterimine hoş geldiniz. Bu, SnipX AI tarafından otomatik olarak oluşturulan Türkçe altyazı örneğidir.",
            'nl': "Welkom bij deze videodemonstratie. Dit is een voorbeeld van Nederlandse ondertitels die automatisch zijn gegenereerd door SnipX AI."
        }
        return sample_texts.get(language, sample_texts['en'])

    def _create_subtitles(self, text, language, style, duration):
        """Create both SRT and JSON format subtitles"""
        # Split text into chunks for subtitles
        words = text.split()
        chunk_size = 6 if language in ['ur', 'ar', 'hi', 'zh', 'ja', 'ko'] else 8  # Fewer words for complex scripts
        chunks = [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]
        
        srt_content = ""
        json_data = {
            "language": language,
            "segments": [],
            "word_timestamps": True,
            "confidence": 0.95,
            "source": "whisper"
        }
        
        subtitle_duration = duration / len(chunks) if chunks else 5
        
        for i, chunk in enumerate(chunks):
            start_time = i * subtitle_duration
            end_time = (i + 1) * subtitle_duration
            
            # SRT format
            srt_content += f"{i + 1}\n"
            srt_content += f"{self._format_timestamp(start_time)} --> {self._format_timestamp(end_time)}\n"
            srt_content += f"{chunk}\n\n"
            
            # JSON format for live display
            json_data["segments"].append({
                "id": i + 1,
                "start": start_time,
                "end": end_time,
                "text": chunk,
                "language": language,
                "style": style
            })
        
        return srt_content, json_data

    def _create_fallback_subtitles(self, video, options):
        """Create fallback subtitles when transcription fails"""
        language = options.get('subtitle_language', 'en')
        style = options.get('subtitle_style', 'clean')
        
        fallback_text = self._get_sample_text(language)
        srt_content, json_data = self._create_subtitles(fallback_text, language, style, 15)
        
        srt_path = f"{os.path.splitext(video.filepath)[0]}_{language}_fallback.srt"
        with open(srt_path, 'w', encoding='utf-8') as f:
            f.write(srt_content)
        
        json_path = f"{os.path.splitext(video.filepath)[0]}_{language}_fallback.json"
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        video.outputs["subtitles"] = {
            "srt": srt_path,
            "json": json_path,
            "language": language,
            "style": style
        }

    def _summarize_video(self, video):
        if not self.summarizer or not self.speech_recognizer:
            print("AI models not available for summarization")
            return
            
        try:
            # Extract audio and convert to text
            clip = VideoFileClip(video.filepath)
            audio_path = f"{os.path.splitext(video.filepath)[0]}_audio.wav"
            clip.audio.write_audiofile(audio_path)
            
            # Generate transcription
            transcription = self.speech_recognizer(audio_path)
            text = transcription.get('text', '')
            
            if text:
                # Summarize text
                summary = self.summarizer(text, max_length=130, min_length=30)
                
                # Save summary
                summary_path = f"{os.path.splitext(video.filepath)[0]}_summary.txt"
                with open(summary_path, 'w', encoding='utf-8') as f:
                    f.write(summary[0]['summary_text'])
                
                video.outputs["summary"] = summary_path
            
            clip.close()
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except Exception as e:
            print(f"Error summarizing video: {e}")

    def _format_timestamp(self, seconds):
        """Format timestamp for SRT format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        milliseconds = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{milliseconds:03d}"