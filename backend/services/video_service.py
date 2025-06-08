import os
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
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.speech_recognizer = pipeline("automatic-speech-recognition")

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
            if options.get('cut_silence'):
                self._cut_silence(video)
            
            if options.get('enhance_audio'):
                self._enhance_audio(video)
            
            if options.get('generate_thumbnail'):
                self._generate_thumbnail(video)
            
            if options.get('generate_subtitles'):
                self._generate_subtitles(video)
            
            if options.get('summarize'):
                self._summarize_video(video)

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
        return [Video.from_dict(video) for video in videos]

    def delete_video(self, video_id, user_id):
        video = self.get_video(video_id)
        if not video:
            raise ValueError("Video not found")
        
        if str(video.user_id) != str(user_id):
            raise ValueError("Unauthorized")
        
        # Delete file
        if os.path.exists(video.filepath):
            os.remove(video.filepath)
        
        # Delete from database
        self.videos.delete_one({"_id": ObjectId(video_id)})

    def _is_valid_video(self, filepath):
        mime = magic.Magic(mime=True)
        file_type = mime.from_file(filepath)
        return file_type.startswith('video/')

    def _extract_metadata(self, video):
        clip = VideoFileClip(video.filepath)
        video.metadata.update({
            "duration": clip.duration,
            "fps": clip.fps,
            "resolution": f"{clip.size[0]}x{clip.size[1]}",
            "format": os.path.splitext(video.filename)[1][1:]
        })
        clip.close()

    def _cut_silence(self, video):
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

    def _enhance_audio(self, video):
        audio = AudioSegment.from_file(video.filepath)
        
        # Apply audio enhancements
        enhanced = audio.normalize()
        enhanced = enhanced.compress_dynamic_range()
        
        # Save enhanced audio
        output_path = f"{os.path.splitext(video.filepath)[0]}_enhanced.mp4"
        enhanced.export(output_path, format="mp4")
        video.outputs["processed_video"] = output_path

    def _generate_thumbnail(self, video):
        cap = cv2.VideoCapture(video.filepath)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames // 2)
        ret, frame = cap.read()
        
        if ret:
            thumbnail_path = f"{os.path.splitext(video.filepath)[0]}_thumb.jpg"
            cv2.imwrite(thumbnail_path, frame)
            video.outputs["thumbnail"] = thumbnail_path
        
        cap.release()

    def _generate_subtitles(self, video):
        # Extract audio
        clip = VideoFileClip(video.filepath)
        audio_path = f"{os.path.splitext(video.filepath)[0]}_audio.wav"
        clip.audio.write_audiofile(audio_path)
        
        # Generate transcription
        transcription = self.speech_recognizer(audio_path)
        
        # Save subtitles in SRT format
        srt_path = f"{os.path.splitext(video.filepath)[0]}.srt"
        with open(srt_path, 'w', encoding='utf-8') as f:
            for i, segment in enumerate(transcription, 1):
                start_time = segment['start']
                end_time = segment['end']
                text = segment['text']
                
                f.write(f"{i}\n")
                f.write(f"{self._format_timestamp(start_time)} --> {self._format_timestamp(end_time)}\n")
                f.write(f"{text}\n\n")
        
        video.outputs["subtitles"] = srt_path
        clip.close()
        os.remove(audio_path)

    def _summarize_video(self, video):
        # Extract audio and convert to text
        clip = VideoFileClip(video.filepath)
        audio_path = f"{os.path.splitext(video.filepath)[0]}_audio.wav"
        clip.audio.write_audiofile(audio_path)
        
        # Generate transcription
        transcription = self.speech_recognizer(audio_path)
        
        # Summarize text
        summary = self.summarizer(transcription['text'], max_length=130, min_length=30)
        
        # Save summary
        summary_path = f"{os.path.splitext(video.filepath)[0]}_summary.txt"
        with open(summary_path, 'w', encoding='utf-8') as f:
            f.write(summary[0]['summary_text'])
        
        video.outputs["summary"] = summary_path
        clip.close()
        os.remove(audio_path)

    def _format_timestamp(self, seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = int(seconds % 60)
        milliseconds = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"