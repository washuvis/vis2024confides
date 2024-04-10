import pandas as pd
import time
import boto3
import botocore
import json_preprocess
import json
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()


aws_client = boto3.client('s3',
aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID"),
aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY"),
region_name = os.environ.get("REGION_NAME"))

aws_client_transcribe = boto3.client('transcribe',
aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID"),
aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY"),
region_name = os.environ.get("REGION_NAME"))

def list_all_files():
  
    contents = []
    for item in aws_client.list_objects(Bucket="lasconfidencescores", Prefix="audio")['Contents']:
        contents.append(item)
    return contents
def list_all_json():
    contents = []
    for item in aws_client.list_objects(Bucket="lasconfidencescores", Prefix="preprocessedjson")['Contents']:
    
        file_name = item["Key"].split('/')[-1].split('.')[0]
        file = get_data(file_name)
        if(file != None):
            file_data = file['Body'].read()
            json_file = file_data.decode('utf-8')
            dict_file = json.loads(json_file)
            contents.append([file_name, dict_file])
    
    return contents

def get_data(filename):
    if(filename == ""):
        return  
    S3_OBJECT_KEY = f"preprocessedjson/{filename}.json"
   
    response = aws_client.get_object(Bucket="lasconfidencescores", Key=S3_OBJECT_KEY)
   
   
        
        # Return the file as a response
    return response  
def get_audio(filename):
    S3_OBJECT_KEY = f"audio/{filename}"
    # print(S3_OBJECT_KEY)
    url = aws_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': "lasconfidencescores",
            'Key': S3_OBJECT_KEY,
        },
        ExpiresIn=3600  # URL expiration time in seconds (adjust as needed)
    )

    return url


def s3_upload_and_transcribe(file, filename):
    response_message = ""
    try:
       aws_client.upload_fileobj(file, "lasconfidencescores", f"audio/{filename}")
       print("uploading to s3...")
       return aws_transcribe(filename)
       
    except botocore.exceptions.NoCredentialsError:
        response_message = 'AWS credentials not found. Check your configuration.'
        return [response_message, 400]
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'AccessDenied':
            response_message = 'Access to the S3 bucket was denied. Check your permissions.'
            return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]
        else:
            
            if e.response["Error"]["Code"] == "ConflictException":
                print("file already exists in S3 but attempting to transcribe the file")
                aws_transcribe(filename)
                return ["Successfully transcribed the audio file", 200]

            else:
                response_message = 'An error occurred during file upload: ' +  e.response['Error']["Message"]
                return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]
        #if the file already exists, not an error but get code and do transcription

   

def aws_transcribe(audio_file_name):
    job_uri = "s3://lasconfidencescores/audio/" + audio_file_name
    job_name = (audio_file_name.split('.')[0]).replace(" ", "")    # file format  
    file_format = audio_file_name.split('.')[1]
  

    try:
        aws_client_transcribe.start_transcription_job(
            TranscriptionJobName=job_name,
            Media={'MediaFileUri': job_uri},
            MediaFormat = file_format,
            LanguageCode='en-US',
            Settings = {'ShowSpeakerLabels': True,
                        'MaxSpeakerLabels': 10,
                        "ShowAlternatives": True,
                            "MaxAlternatives": 3,

                        })
        print("transcribing...")
        while True:
            result = aws_client_transcribe.get_transcription_job(TranscriptionJobName=job_name)
            if result['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                break
            time.sleep(15)
        if result['TranscriptionJob']['TranscriptionJobStatus'] == "COMPLETED":
            data = pd.read_json(result['TranscriptionJob']['Transcript']['TranscriptFileUri'])
            preprocessed_json = json_preprocess.json_preprocess(data, data["jobName"])
            print("successfully transcribed the audio file.")
            return upload_preprocessed_json_to_s3(preprocessed_json, job_name)
    except botocore.exceptions.NoCredentialsError:
        response_message = 'AWS credentials not found. Check your configuration.'
        return [response_message, 400]
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'AccessDenied':
            response_message = 'Access to the S3 bucket was denied. Check your permissions.'
            return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]
        else:
            if e.response["Error"]["Code"] == "ConflictException":
                print("transcription already exists. Attempting to preprocess")
                while True:
                    result = aws_client_transcribe.get_transcription_job(TranscriptionJobName=job_name)
                    if result['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                        break
                    time.sleep(15)
                if result['TranscriptionJob']['TranscriptionJobStatus'] == "COMPLETED":
                    data = pd.read_json(result['TranscriptionJob']['Transcript']['TranscriptFileUri'])
                    preprocessed_json = json_preprocess.json_preprocess(data, data["jobName"])
                 
                    return upload_preprocessed_json_to_s3(preprocessed_json, job_name)
            else:
                response_message = 'An error occurred during file upload: ' +  e.response['Error']["Message"]
                return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]


def upload_preprocessed_json_to_s3(preprocessed_json, file_name):
    try:
        aws_client.upload_fileobj(preprocessed_json, "lasconfidencescores", f"preprocessedjson/{file_name}.json")
        print("uploading preprocessed json to s3")
        return ["Successfully uploaded to S3, transcribed the audio file and uploaded preprocessed transcription to s3", 200]

    except botocore.exceptions.NoCredentialsError:
        response_message = 'AWS credentials not found. Check your configuration.'
        return [response_message, 400]
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'AccessDenied':
            response_message = 'Access to the S3 bucket was denied. Check your permissions.'
            return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]
        else:
            
                response_message = 'An error occurred during file upload: ' +  e.response['Error']["Message"]
                return [response_message, e.response['Error']['ResponseMetadata']['HTTPStatusCode']]
