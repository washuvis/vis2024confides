import json
import sys
import re
import aws_transcribe
from homophones import Pyphones

def create_sententree(filename, target_word):
    response = aws_transcribe.get_data(filename)
    file_data = response['Body'].read()
    homophones = []
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
    # data["text"] = f"Context windows for '{target_word}':"
    if target_word != '':
        result = Pyphones(target_word).get_the_homophones()[target_word]
        if len(result) > 0:
            homophones = result[0]
    data["homophones"] = homophones

    json_data = json.dumps(data)
    return json_data