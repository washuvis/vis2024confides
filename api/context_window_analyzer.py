import json
import sys
import aws_transcribe

def create_context_windows(tokens, target_words, window_size):
    context_windows = {}
    
    for target_word in target_words:
        context_windows[target_word] = []
        for i in range(len(tokens)):
            if tokens[i][0].lower() == target_word.lower():
                start_index = max(0, i - window_size)
                end_index = min(len(tokens) - 1, i + window_size)

                context_window = [tokens[j] for j in range(start_index, end_index + 1)]
                context_windows[target_word].append(context_window)
    
    return context_windows

def publish_context_windows(filename, target_word, num_words:int):
    print(num_words)
    response = aws_transcribe.get_data(filename)
    file_data = response['Body'].read()
   
   
    data = json.loads(file_data)
    
  

    #words = [entry["list_words"]["word"] for entry in list_words.values()]
    tokens = []
    for key, entry in data.items():
        for item in entry["list_words"]:
            if not item["is_punctuation"]:
                tokens.append((item['word'], item['conf_val'], key))
       

    

    target_words = [target_word]

    window_size = num_words



    context_windows = create_context_windows(tokens, target_words, window_size)
    data = {}
    data["data"] = []
    for target_word, windows in context_windows.items():
    #  print(f"Context windows for '{target_word}':")
        data["text"] = f"Context windows for '{target_word}':"
        
        for i,window in enumerate(windows):
        # print(window)
            data["data"].append(window)


    json_data = json.dumps(data)
    return json_data
