import os
import sys
from static_ffmpeg import run
import argparse
from omegaconf import OmegaConf
import torch
from dotenv import load_dotenv
from utils import send_email_with_attachment

ffmpeg_path, _ = run.get_or_fetch_platform_executables_else_raise()
os.environ['FFMPEG_PATH'] = ffmpeg_path

current_dir = os.path.dirname(os.path.abspath(__file__))
musetalk_dir = os.path.join(current_dir, 'MuseTalk')
sys.path.extend([current_dir, musetalk_dir])

from musetalk.utils.utils import load_all_model
from scripts.inference import main as musetalk_inference
from luma import generate_video, generate_double_video, generate_triple_video
from elevenlabs import create_instant_voice_clone, generate_audio

# Load model weights
audio_processor, vae, unet, pe = load_all_model()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
timesteps = torch.tensor([0], device=device)

def run_musetalk(video_path, audio_path, result_dir='./results', bbox_shift=0, fps=25, batch_size=8):
    # temporary config file
    config = {
        'task_0': {
            'video_path': video_path,
            'audio_path': audio_path,
            'bbox_shift': bbox_shift
        }
    }
    
    config_path = 'temp_config.yaml'
    with open(config_path, 'w') as f:
        OmegaConf.save(config=config, f=f)

    # Set up arguments for MuseTalk inference
    args = argparse.Namespace(
        inference_config=config_path,
        bbox_shift=bbox_shift,
        result_dir=result_dir,
        fps=fps,
        batch_size=batch_size,
        output_vid_name=None,
        use_saved_coord=False,
        use_float16=False
    )

    # Run MuseTalk inference
    musetalk_inference(args)

    # Clean up temporary config file
    os.remove(config_path)

    # Return the path of the generated video
    output_basename = f"{os.path.basename(video_path).split('.')[0]}_{os.path.basename(audio_path).split('.')[0]}"
    return os.path.join(result_dir, f"{output_basename}.mp4")

def main(image_path, voice_sample_path, text, image_prompt, luma_api_key, elevenlabs_api_key, result_dir='./results', recipient_email=None):
    video_path = generate_video(image_path, image_prompt, luma_api_key)

    voice_id = "CkVOwuK94BHPOuKUR76m"
    if voice_id:
        audio_path = generate_audio(voice_id, text, elevenlabs_api_key)
    else:
        raise Exception("Voice cloning failed")

    result_path = run_musetalk(video_path, audio_path, result_dir, bbox_shift=-10)

    if recipient_email:
        sender_email = "myposthuman@gmail.com"
        subject = "Your MuseTalk Video"
        body = "Please find attached the MuseTalk generated video."
        send_email_with_attachment(sender_email, recipient_email, subject, body, result_path)

    return result_path

if __name__ == "__main__":
    load_dotenv(dotenv_path="/Users/shivanshsoni/Desktop/posthuman/server/MuseTalk/.env")
    luma_api_key = os.getenv("LUMAAI_API_KEY")
    elabs_api_key = os.getenv("ELEVENLABS_API_KEY")

    image_path = "/Users/shivanshsoni/Desktop/posthuman/server/assets/jeffrey.JPG"
    voice_sample_path = "/Users/shivanshsoni/Desktop/posthuman/server/jeffrey_audio/sample.mp3"
    text = "Happy Birthday Son. I love you so much. I hope you have a great day."
    image_prompt = ("Still shot of person's face showing an expression of love and care. Their body is not moving. Face very slightly.")
    result_dir = "./results"
    recipient_email = "shivanshmsoni@gmail.com"

    result = main(image_path, voice_sample_path, text, image_prompt, luma_api_key, elabs_api_key, result_dir, recipient_email)
    print(f"MuseTalk inference completed. Final output video saved at: {result}")