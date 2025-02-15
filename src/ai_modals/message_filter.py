import os
import re

# Define input and output directory
input_dir = os.path.expanduser("~/Desktop/messages.txt/")
output_dir = os.path.expanduser("~/Desktop/messages_filtered/")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Iterate through all .txt files in the directory
for filename in os.listdir(input_dir):
    if filename.endswith(".txt"):
        input_file = os.path.join(input_dir, filename)
        output_file = os.path.join(output_dir, filename.replace(".txt", "_filtered.txt"))
        
        with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8") as outfile:
            lines = infile.readlines()
            capturing = False
            message_text = []
            
            for line in lines:
                stripped_line = line.strip()
                
                # Identify messages sent by "Me"
                if stripped_line.endswith("Me"):
                    capturing = True
                    continue
                
                if capturing:
                    if stripped_line == "" or re.match(r"^\w{3} \d{1,2}, \d{4} ", stripped_line):
                        capturing = False
                        if message_text:
                            outfile.write(" ".join(message_text) + "\n")
                            message_text = []
                    else:
                        message_text.append(stripped_line)

print(f"Filtered messages saved in {output_dir}")