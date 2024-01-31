import aws_transcribe

def get_avg_conf_score():    
    response = {}
    docs = aws_transcribe.list_all_json()
    for file_name, doc in docs:
        
        all_conf = []
        for k,v in doc.items():
            for word in v["list_words"]:
                all_conf.append(word["conf_val"])
        response[file_name] =  sum(all_conf) / len(all_conf)

    return response