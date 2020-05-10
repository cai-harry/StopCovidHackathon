from os import path
import torch
from flask import Flask, request, abort, Response, json, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)

ALLOWED_FILE = 'net.py'
SAVED_MODEL_NAME = 'model.pt'

def init_syft_workers():
    # TODO: Implement, make necessary imports and
    # update requirements.txt file!
    pass

def init_blockchain():
    # TODO: Implement, make necessary imports and
    # update requirements.txt file!
    pass

def allowed_file(filename):
    return filename == ALLOWED_FILE

def load_model(filename):
    from net import Net
    model = Net()
    return model

def train_model(model):
    # TODO: Dima -> Implement federated training
    # TODO: Harry -> Perform blockchain operations
    # This function should return 2 things:
    # 1. The trained model
    # 2. A dictionary with the accuracy, and contributions of the 3 sites
    metrics = {}

    metrics['accuracy'] = 0.0 #TODO replace
    metrics['contrib_a'] = 0.0 # TODO: replace
    metrics['contrib_b'] = 0.0 # TODO: replace
    metrics['contrib_c'] = 0.0 # TODO: replace

    return model, metrics

@app.route('/api/upload', methods = ['POST'])
def upload_file():
    if 'model_file' not in request.files:
        print('No file part in request!')
        abort(500)
    file = request.files['model_file']
    
    if file.filename == '':
        print("No file uploaded!")
        abort(500)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(filename)
    else:
        print("Invalid filename. File must be named net.py")
        abort(500)
    
    model = load_model(filename)
    fl_model, metrics = train_model(model)
    torch.save(fl_model.state_dict(), SAVED_MODEL_NAME)

    response = Response(response=json.dumps(metrics),
                        status=200,
                        mimetype='application/json')


    # TODO: Remove this when actual code is implemented. 
    # Just here to show the front-end works as intended
    import time
    time.sleep(10)

    return response

@app.route('/api/download')
def download_file():
    if path.exists(SAVED_MODEL_NAME):
        return send_from_directory(
            "", SAVED_MODEL_NAME, as_attachment=True
        )
    
    print("Model has not been trained yet")
    abort(500)

# TODO: Dima / Harry - Initialise Syft Workers and blockchain stuff
# Place server initialisation code here
init_syft_workers()
init_blockchain()