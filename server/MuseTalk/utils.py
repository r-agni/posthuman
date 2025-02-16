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
import os


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


def send_email_with_attachment(sender_email, to_email, subject, body, attachment_path):
    creds = Credentials.from_authorized_user_file('path/to/your/credentials.json', ['https://www.googleapis.com/auth/gmail.send'])
    service = build('gmail', 'v1', credentials=creds)

    message = MIMEMultipart()
    message['to'] = to_email
    message['from'] = sender_email
    message['subject'] = subject

    message.attach(MIMEText(body))

    with open(attachment_path, 'rb') as file:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(file.read())
    
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(attachment_path)}')
    message.attach(part)

    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    body = {'raw': raw_message}

    try:
        message = service.users().messages().send(userId="me", body=body).execute()
        print(f"Message Id: {message['id']}")
    except Exception as e:
        print(f"An error occurred: {e}")

