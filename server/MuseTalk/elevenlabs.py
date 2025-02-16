import os
import requests
from dotenv import load_dotenv

def create_instant_voice_clone(audio_file_path, elevenlabs_api_key, voice_name='My Cloned Voice', description=None, labels=None, remove_background_noise=False):
    VOICE_NAME = voice_name
    API_URL = 'https://api.elevenlabs.io/v1/voices/add'

    headers = {
        'xi-api-key': elevenlabs_api_key
    }

    data = {
        'name': VOICE_NAME,
        'remove_background_noise': str(remove_background_noise).lower()  # Convert bool to lowercase string
    }
    if description:
        data['description'] = description
    if labels:
        data['labels'] = str(labels)  # Serialize labels dictionary

    files = {
        'files': open(audio_file_path, 'rb')
    }

    try:
        response = requests.post(API_URL, headers=headers, data=data, files=files)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        response_json = response.json()

        if 'voice_id' in response_json:
            print('Voice clone created successfully')
            print('Voice ID:', response_json['voice_id'])
            print('Requires Verification:', response_json.get('requires_verification', False))
            return response_json['voice_id']
        else:
            print('Unexpected response format:', response_json)
            return None


    except requests.exceptions.RequestException as e:
        print(f'Error creating voice clone: {e}')
        if e.response is not None:
            print(f'Response status code: {e.response.status_code}')
            print(f'Response text: {e.response.text}')
        return None
    finally:
        files['files'].close()


def generate_audio(voice_id, text, elevenlabs_api_key, output_format="mp3_44100_128", model_id="eleven_multilingual_v2"):
    API_URL = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'

    headers = {
        'xi-api-key': elevenlabs_api_key,
        'Content-Type': 'application/json'
    }

    data = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    params = {
        "output_format": output_format
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers, params=params)
        response.raise_for_status()

        output_filename = f"generated_audio_{voice_id}.{output_format.split('_')[0]}"
        
        with open(output_filename, 'wb') as audio_file:
            audio_file.write(response.content)
        
        print(f"Audio generated successfully and saved as {output_filename}")
        return output_filename

    except requests.exceptions.RequestException as e:
        print(f'Error generating audio: {e}')
        if e.response is not None:
            print(f'Response status code: {e.response.status_code}')
            print(f'Response text: {e.response.text}')
        return None


if __name__ == "__main__":
    load_dotenv(dotenv_path="/Users/shivanshsoni/Desktop/posthuman/server/MuseTalk/.env")
    elabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = "huzOv7CucEhJL2QYee4p"
    text = "The first move is what sets everything in motion."
    audio_file = generate_audio(voice_id, text, elevenlabs_api_key=elabs_api_key)
    if audio_file:
        print(f"Audio generated: {audio_file}")
    else:
        print("Failed to generate audio")
    # load_dotenv(dotenv_path="/Users/shivanshsoni/Desktop/posthuman/server/.env")
    # elabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    # audio_file_path = 'path/to/your/audio/file.mp3' # edit with test file
    # voice_id = create_instant_voice_clone(audio_file_path, description="A warm, friendly voice",  elevenlabs_api_key=elabs_api_key, labels={"accent": "American"})

    # if voice_id:
    #     print(f"Voice cloning successful, Voice ID: {voice_id}")
    # else:
    #     print("Voice cloning failed.")
