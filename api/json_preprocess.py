import numpy as np
import json
import collections
import io



def json_preprocess(data, data_name):
    print("preprocess started")
 
    segmentsJsonBuilder = collections.defaultdict(dict)
    results = data['results']
    segments = results['segments']
    speaker_labels = results["speaker_labels"]


    for j, items in enumerate(segments):
        segmentsJsonBuilder[j] = {
            "start_time" : float(items["start_time"]),
            "end_time" : float(items["end_time"]),
            "text" : items["alternatives"][0]["transcript"],
            "speaker": speaker_labels["segments"][j]["speaker_label"],
            "list_words" : []

        }
        if "alternatives" in items:
            alternative_word_indicies = [item for item in range(1, len(items["alternatives"]) - 1)]
            for i,item in enumerate(items["alternatives"][0]["items"]):
                if 'start_time' in item:
                    segmentsJsonBuilder[j]["list_words"].append( {
                            "start_time" : float(item["start_time"]),
                            "end_time" : float(item["end_time"]),
                            "word" : item["content"],
                            "conf_val" : float(item["confidence"]),
                            "is_punctuation": False,
                            # "alternatives": map(lambda alt_cnt: items['alternatives'][alt_cnt]["items"]["content"], alternative_word_indicies)
                        })
            
                else:
                    segmentsJsonBuilder[j]["list_words"].append(  {
                            "start_time" : 0,
                            "end_time" : 0,
                            "word" : item ["content"],
                            "conf_val" : float(item ["confidence"]),
                            "is_punctuation": True,
                            # "alternatives": []
                        })


    print("preprocess completed.")

  
    return io.BytesIO(json.dumps(segmentsJsonBuilder).encode('utf-8'))
