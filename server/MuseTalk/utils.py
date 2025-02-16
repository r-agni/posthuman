from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import base64
import requests
import subprocess
import smtplib
import os
from pydub import AudioSegment
from email.message import EmailMessage


def get_duration_wave(file_path):
    audio_file = AudioSegment.from_file(file_path)
    duration = audio_file.duration_seconds
    return duration


def upload_image_to_imgbb(api_key, image_path):
    with open(image_path, "rb") as file:
        url = "https://api.imgbb.com/1/upload"
        payload = {
            "key": api_key,
            "image": base64.b64encode(file.read()),
        }
        res = requests.post(url, payload)
        if res.status_code == 200:
            return res.json()['data']['url']
        else:
            raise Exception(f"Upload failed: {res.status_code} - {res.text}")

def extract_last_frame(video_path, output_image):
    command = [
        "ffmpeg", "-sseof", "-1", "-i", video_path,
        "-update", "1", "-q:v", "1", output_image
    ]
    subprocess.run(command, check=True)

def join_videos(video_paths, output_path):
    temp_file = "files.txt"
    with open(temp_file, "w") as f:
        for video in video_paths:
            f.write(f"file '{video}'\n")
    subprocess.run([
        "ffmpeg", "-f", "concat", "-safe", "0",
        "-i", temp_file, "-c", "copy", output_path
    ], check=True)
    os.remove(temp_file)


def send_email_with_attachment(to_email, subject, body, attachment_path):
    # Gmail SMTP Configuration
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587 # Use 465 for SSL, 587 for TLS
    SMTP_USERNAME = "jeffreygong1207@gmail.com" # Replace with your Gmail address
    SMTP_PASSWORD = "nzip gdjv giyd znlv" # Use an App Password from Google (if 2FA is on)

    # Email Details
    SENDER_EMAIL = SMTP_USERNAME
    RECIPIENT_EMAIL = to_email # Replace with actual recipient's email
    VIDEO_PATH = attachment_path # Change to the correct path of your video file

    # Create the email message
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECIPIENT_EMAIL
    msg.set_content(body)

    # Attach the video file
    if os.path.exists(VIDEO_PATH):
        with open(VIDEO_PATH, "rb") as video:
            msg.add_attachment(video.read(), maintype="video", subtype="mp4", filename=os.path.basename(VIDEO_PATH))
    else:
        print("Error: Video file not found!")
        exit()

    # Send the email
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls() # Secure the connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            print("Email sent successfully with the video attachment!")
    except Exception as e:
        print(f"Error sending email: {e}")