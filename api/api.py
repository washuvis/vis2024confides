from flask import Flask, redirect, url_for, request, jsonify, send_file,make_response, render_template, send_from_directory
from flask_cors import CORS, cross_origin
import aws_transcribe
import average_conf_val
import io
import os

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
   
# @app.route('/')
# def index():
#     return render_template("index.html")

@app.route('/upload',methods = ['POST'])
@cross_origin()
def post_aws_transcribe():

   uploaded_file = request.files['file']
   message, response_code = aws_transcribe.s3_upload_and_transcribe(uploaded_file, uploaded_file.filename)
   response_data = {'message': message}
#    print(response_data["message"])
   return jsonify(response_data), response_code
   # return aws_transcribe.amazon_transcribe("911.mp3")
   #return 


# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=32772, debug=True)