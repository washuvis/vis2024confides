import json
import sys
import re
import aws_transcribe

def create_sententree(filename, target_word):
    response = aws_transcribe.get_data(filename)
    file_data = response['Body'].read()
   
    data = json.loads(file_data)
    sentences = []
    sentences.append(['Phrases'])
    for key, entry in data.items(): 
        if target_word:
            lowered_text = entry['text'].lower()
            if target_word.lower() in lowered_text:
                cleaned_text = re.sub(r'[^\w\s]', '', lowered_text)
                sentences.append([cleaned_text])

    data = {}
    data["data"] = sentences
    data["text"] = f"Context windows for '{target_word}':"
    # print(data["data"])

    json_data = json.dumps(data)
    return json_data