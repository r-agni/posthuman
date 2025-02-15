import re
import csv
import os

def parse_vcf(file_path):
    contacts = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        current_name = None
        for line in file:
            line = line.strip()
            if line.startswith("FN:"):  # Extract Full Name
                current_name = line[3:].strip()
            elif line.startswith("TEL") and current_name:  # Extract Phone Number
                phone_number = re.sub(r'[^0-9+]', '', line.split(":")[-1])  # Clean number
                if current_name in contacts:
                    contacts[current_name].add(phone_number)
                else:
                    contacts[current_name] = {phone_number}
    return contacts

def save_to_csv(contacts, output_path):
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Name", "Phone Numbers"])
        for name, numbers in contacts.items():
            writer.writerow([name, ", ".join(numbers)])

# Set file paths
desktop_path = os.path.expanduser("~/Desktop")
vcf_file = os.path.join(desktop_path, "aaryavi and 548 others.vcf")  # Update if filename differs
output_csv = os.path.join(desktop_path, "contacts_lookup.csv")

# Process VCF file
contacts = parse_vcf(vcf_file)
save_to_csv(contacts, output_csv)

print(f"Contacts saved to {output_csv}")
