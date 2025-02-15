import mailbox
import os
import re
import email
from email.header import decode_header
from bs4 import BeautifulSoup

# Define paths
DESKTOP_PATH = os.path.expanduser("~/Desktop")
MBOX_FILE = os.path.join(DESKTOP_PATH, "All mail Including Spam and Trash-002.mbox")
OUTPUT_DIR = os.path.join(DESKTOP_PATH, "mailbox")

# Create the mailbox folder if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_filename(text):
    """Sanitize filenames by removing invalid characters."""
    if not isinstance(text, str):
        return "Unknown_Subject"
    text = re.sub(r'[<>:"/\\|?*]', '', text)  # Remove invalid filename characters
    text = text.strip().replace(" ", "_")  # Replace spaces with underscores
    return text[:50]  # Limit filename length to avoid issues

def decode_subject(subject):
    """Decode email subject from MIME format."""
    if subject is None:
        return "No_Subject"
    decoded_parts = decode_header(subject)
    subject_parts = []
    for part, encoding in decoded_parts:
        if isinstance(part, bytes):
            try:
                part = part.decode(encoding or "utf-8", errors="ignore")
            except Exception:
                part = "Unknown_Subject"
        subject_parts.append(part)
    return " ".join(subject_parts)

def extract_body(email_msg):
    """Extract email body, preferring plain text over HTML."""
    body = ""
    if email_msg.is_multipart():
        for part in email_msg.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                body = part.get_payload(decode=True).decode(errors="ignore")
                break  # Prefer plain text over HTML
            elif content_type == "text/html" and not body:
                # Extract text from HTML using BeautifulSoup
                html_body = part.get_payload(decode=True).decode(errors="ignore")
                body = BeautifulSoup(html_body, "html.parser").get_text()
    else:
        body = email_msg.get_payload(decode=True).decode(errors="ignore")

    return body.strip()

def process_mbox(mbox_file):
    if not os.path.exists(mbox_file):
        print(f"Error: MBOX file '{mbox_file}' not found.")
        return
    
    mbox = mailbox.mbox(mbox_file)
    
    for i, msg in enumerate(mbox):
        subject = decode_subject(msg["subject"])
        sender = msg["from"] or "Unknown_Sender"
        date = msg["date"] or "Unknown_Date"

        # Clean and format filename
        safe_subject = clean_filename(subject)
        filename = f"{i:05d}_{safe_subject}.txt"
        filepath = os.path.join(OUTPUT_DIR, filename)

        # Extract email body
        body = extract_body(msg)

        # Save email to a text file
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"From: {sender}\n")
            f.write(f"Date: {date}\n")
            f.write(f"Subject: {subject}\n")
            f.write("\n" + body)

        print(f"Saved: {filename}")

if __name__ == "__main__":
    process_mbox(MBOX_FILE)
