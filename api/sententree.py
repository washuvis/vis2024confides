import json
import sys
import aws_transcribe

def create_sententree(filename, target_word):
    response = aws_transcribe.get_data(filename)
    file_data = response['Body'].read()
   
    data = json.loads(file_data)
    sentences = []
    sentences.append(['Phrases'])
    for key, entry in data.items(): 
        if target_word:
            if target_word.lower() in entry['text'].lower():
                # sentence = {}
                # sentence['id'] = int(key)
                # sentence['text'] = entry['text']
                sentences.append([entry['text']])

    data = {}
    data["data"] = sentences
    data["text"] = f"Context windows for '{target_word}':"
    print(data["data"])

    json_data = json.dumps(data)
    return json_data