import os
import json
from ics import Calendar

# Paths
DESKTOP_PATH = os.path.expanduser("~/Desktop")
ICS_FILE = os.path.join(DESKTOP_PATH, "calendar.ics")  # Update filename if needed
OUTPUT_TXT_FILE = os.path.join(DESKTOP_PATH, "important_events.txt")

def parse_ics(ics_file):
    """Parses an .ics file and extracts event details."""
    events_list = []
    
    # Read the .ics file
    with open(ics_file, "r", encoding="utf-8") as f:
        calendar = Calendar(f.read())

    for event in calendar.events:
        event_dict = {
            "title": event.name or "No Title",
            "start": event.begin.strftime("%Y-%m-%d %H:%M"),
            "end": event.end.strftime("%Y-%m-%d %H:%M") if event.end else "N/A",
            "description": event.description or "No Description",
            "location": event.location or "No Location"
        }
        events_list.append(event_dict)

    return events_list

def save_to_txt(events, output_file):
    """Saves the extracted events to a .txt file."""
    with open(output_file, "w", encoding="utf-8") as f:
        for event in events:
            f.write(f"Title: {event['title']}\n")
            f.write(f"Start: {event['start']}\n")
            f.write(f"End: {event['end']}\n")
            f.write(f"Location: {event['location']}\n")
            f.write(f"Description: {event['description']}\n")
            f.write("-" * 40 + "\n")

    print(f"Saved extracted events to {output_file}")

if __name__ == "__main__":
    if not os.path.exists(ICS_FILE):
        print(f"Error: .ics file not found at {ICS_FILE}")
    else:
        events = parse_ics(ICS_FILE)
        
        # Print dictionary output
        print(json.dumps(events, indent=4))

        # Save events to a text file
        save_to_txt(events, OUTPUT_TXT_FILE)
