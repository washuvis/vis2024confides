from flask import Flask, redirect, url_for, request, jsonify, send_file,make_response, render_template, send_from_directory
from flask_cors import CORS, cross_origin
import aws_transcribe
import context_window_analyzer
import average_conf_val
import io
import os
import sententree

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/files',methods = ['GET'])
@cross_origin()
def getAllFiles():
    return aws_transcribe.list_all_files()

@app.route('/data',methods = ['GET'])
@cross_origin()
def getData():
    file_name = request.args.get('file')
    S3_OBJECT_KEY = f"preprocessedjson/{file_name}.json"
    response = aws_transcribe.get_data(filename=file_name)
    file_data = response['Body'].read()
    content_type = response['ContentType']
    filename = S3_OBJECT_KEY.split("/")[-1]
    response = make_response(file_data)
    response.headers['Content-Type'] = content_type
    response.headers['Content-Disposition'] = f'attachment; filename={filename}'
    return response

@app.route('/averageConfVal',methods = ['GET'])
@cross_origin()
def get_average_conf_val():
    response = average_conf_val.get_avg_conf_score()
    return response

@app.route('/audio',methods = ['GET'])
@cross_origin()
def getAudio():
    file_name = request.args.get('file')
    S3_OBJECT_KEY = f"audio/{file_name}"
    response = aws_transcribe.get_audio(filename=file_name)
    return response
   
@app.route('/contextwindow',methods = ['POST'])
@cross_origin()
def post_context_windows():
    filename = request.json['filename']
    print(filename)
    target_word = request.json['target_word']
    num_words = int(request.json["num_words"])
    return context_window_analyzer.publish_context_windows(filename, target_word, num_words)

@app.route('/sententree',methods = ['POST'])
@cross_origin()
def post_sententree_data():
    filename = request.json['filename']
    print(filename)
    target_word = request.json['target_word']
    return sententree.create_sententree(filename, target_word)

@app.route('/upload',methods = ['POST'])
@cross_origin()
def post_aws_transcribe():

   uploaded_file = request.files['file']
   message, response_code = aws_transcribe.s3_upload_and_transcribe(uploaded_file, uploaded_file.filename)
   response_data = {'message': message}
   return jsonify(response_data), response_code