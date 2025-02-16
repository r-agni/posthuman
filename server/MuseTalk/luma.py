import os
import time
import requests
from lumaai import LumaAI
from utils import upload_image_to_imgbb, join_videos, extract_last_frame
from dotenv import load_dotenv

def generate_video(image_file, prompt, luma_api_key):
    client = LumaAI(auth_token=luma_api_key)
    imgbb_api_key = os.getenv("IMGBB_API_KEY")

    image_url = upload_image_to_imgbb(imgbb_api_key, image_file)

    # Create the generation
    generation = client.generations.create(
        prompt=prompt,
        model="ray-2",
        keyframes={
            "frame0": {
                "type": "image",
                "url": image_url
            }
        }
    )

    # Poll for completion
    completed = False
    while not completed:
        generation = client.generations.get(id=generation.id)
        if generation.state == "completed":
            completed = True
            video_url = generation.assets.video
            print(f"Video generated successfully. URL: {video_url}")
        elif generation.state == "failed":
            raise RuntimeError(f"Generation failed: {generation.failure_reason}")
        print("Processing...")
        time.sleep(3)

    # Download the video
    video_folder = "/Users/shivanshsoni/Desktop/posthuman/server/videos"
    os.makedirs(video_folder, exist_ok=True)
    video_path = os.path.join(video_folder, f'{generation.id}.mp4')

    response = requests.get(video_url, stream=True)
    with open(video_path, 'wb') as file:
        file.write(response.content)
    print(f"Video downloaded as {video_path}")
    return video_path

def generate_double_video(image_file, prompt, api_key):
    print("Generating first 5-second video...")
    first_video = generate_video(image_file, prompt, api_key)
    
    last_frame_image = os.path.join(
        "/Users/shivanshsoni/Desktop/posthuman/server/assets",
        f'last_frame_{int(time.time())}.jpg'
    )
    print("Extracting last frame from first video...")
    extract_last_frame(first_video, last_frame_image)
    
    print("Generating second 5-second video...")
    second_video = generate_video(last_frame_image, prompt, api_key)
    
    # Join the two videos
    output_video = os.path.join(
        "/Users/shivanshsoni/Desktop/posthuman/server/videos",
        f'double_{int(time.time())}.mp4'
    )
    print("Joining videos to create a smooth 10-second video...")
    join_videos([first_video, second_video], output_video)
    print(f"Double video generated and saved as {output_video}")
    
    return output_video

def generate_triple_video(image_file, prompt, api_key):
    print("Generating first 5-second video...")
    first_video = generate_video(image_file, prompt, api_key)
    
    # Extract last frame from first video
    last_frame_image1 = os.path.join(
        "/Users/shivanshsoni/Desktop/posthuman/server/assets",
        f'last_frame1_{int(time.time())}.jpg'
    )
    print("Extracting last frame from first video...")
    extract_last_frame(first_video, last_frame_image1)
    
    print("Generating second 5-second video...")
    second_video = generate_video(last_frame_image1, prompt, api_key)
    
    # Extract last frame from second video
    last_frame_image2 = os.path.join(
        "/Users/shivanshsoni/Desktop/posthuman/server/assets",
        f'last_frame2_{int(time.time())}.jpg'
    )
    print("Extracting last frame from second video...")
    extract_last_frame(second_video, last_frame_image2)
    
    print("Generating third 5-second video...")
    third_video = generate_video(last_frame_image2, prompt, api_key)
    
    # Join the three videos
    output_video = os.path.join(
        "/Users/shivanshsoni/Desktop/posthuman/server/videos",
        f'triple_{int(time.time())}.mp4'
    )
    print("Joining videos to create a smooth 15-second video...")
    join_videos([first_video, second_video, third_video], output_video)
    print(f"Triple video generated and saved as {output_video}")

    return output_video


if __name__ == "__main__":
    load_dotenv(dotenv_path="/Users/shivanshsoni/Desktop/posthuman/server/MuseTalk/.env")
    luma_api_key = os.getenv("LUMAAI_API_KEY")
    image_file = "/Users/shivanshsoni/Desktop/posthuman/server/assets/lebron.jpeg"
    prompt = ("Still shot of person's face showing a expression of sincere love and looking like they are proud of you. They are not smiling but they are happy.")
    generate_video(image_file, prompt, luma_api_key)