from os import path
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import joblib
import time
import numpy as np
from flask import Flask, request, abort, Response, json, send_from_directory
from sklearn.model_selection import train_test_split
from werkzeug.utils import secure_filename
import data_utils
import syft as sy
from syft.frameworks.torch.fl import utils
hook = sy.TorchHook(torch)

app = Flask(__name__)

ALLOWED_FILE = 'net.py'
SAVED_MODEL_NAME = 'model.pt'

WEI_PER_UNIT_LOSS = 1e18

df = joblib.load("Data.bin")
epochs = 10
batch_size = 8
learning_rate = 1e-2
loss_criterion = torch.nn.BCELoss()
number_of_workers = 3


def init_syft_workers():
    # create 3 workers and split the data between them
    # aggregator for now just: hosts the data, tests the model
    # for future discussion: MPC, Rewards, Crypto provider
    workers = data_utils.generate_virtual_workers(number_of_workers, hook)
    central_server = sy.VirtualWorker(hook, id="aggregator")

    # Use sklearn to split into train and test
    X_train, X_val, y_train, y_val = train_test_split(
        df.drop(["ICU"], 1),
        df["ICU"],
        test_size=0.2,
        random_state=101,
        stratify=df["ICU"]
    )

    # Create a federated dataset using BaseDataset for all train
    # frames and randomly share them in an IID manner between clients
    record_list, result_list = data_utils.split_into_lists(X_train, y_train)
    record_list = data_utils.convert_to_tensors(record_list)
    base_federated_set = sy.BaseDataset(
        record_list, result_list).federate(workers)
    federated_train_loader = sy.FederatedDataLoader(base_federated_set)

    test_list, test_labels = data_utils.split_into_lists(X_val, y_val)
    test_list = data_utils.convert_to_tensors(test_list)
    test_dataset = sy.BaseDataset(test_list, test_labels)
    test_loader = torch.utils.data.DataLoader(test_dataset)
    # TODO: Implement, make necessary imports and
    # update requirements.txt file!
    return workers, federated_train_loader, test_loader


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

# Utilize the dataset of pointers to clients data
# to send each of them the model and get it back at the end
# TODO: someone needs to verify this works as intended


def train(model, federated_train_loader, optimizer, epoch):
    model.train()
    for batch_idx, (data, target) in enumerate(federated_train_loader):
        test_loss_before = test(model, test_loader)
        model.send(data.location)
        optimizer.zero_grad()
        output = model(data)
        train_loss = loss_criterion(output, target.float())
        train_loss.backward()
        optimizer.step()
        model.get()
        test_loss_after = test(model, test_loader)
        tokens_earned = int(
            max(0, test_loss_before - test_loss_after) * WEI_PER_UNIT_LOSS)
        contract.giveTokens(accounts[data.location], tokens_earned)
        if batch_idx % 20 == 0:
            train_loss = train_loss.get()
            print('Train Epoch: {} [{}/{} ({:.0f}%)]\tLoss: {:.6f}'.format(
                epoch, batch_idx *
                batch_size, len(federated_train_loader) * batch_size,
                100. * batch_idx / len(federated_train_loader), train_loss.item()))


def test(model, test_loader):
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for data, target in test_loader:
            output = model(data)
            loss = loss_criterion(output, target.float()).item()
            total_loss += loss
    mean_loss = total_loss / len(test_loader)
    print(f"Test:\tLoss: {mean_loss:.6f}")
    return total_loss / len(test_loader)


def train_model(model):
    optimizer = optim.SGD(model.parameters(), lr=learning_rate)
    # init hyperparameters
    for epoch in range(1, epochs + 1):
        train(model, federated_train_loader, optimizer, epoch)
    # TODO: Dima -> Implement federated training
    # TODO: Harry -> Perform blockchain operations
    # This function should return 2 things:
    # 1. The trained model
    # 2. A dictionary with the accuracy, and contributions of the 3 sites
    metrics = {}

    metrics['accuracy'] = 0.0  # TODO replace
    metrics['contrib_a'] = 0.0  # TODO: replace
    metrics['contrib_b'] = 0.0  # TODO: replace
    metrics['contrib_c'] = 0.0  # TODO: replace

    return model, metrics


@app.route('/api/upload', methods=['POST'])
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
workers, federated_train_loader, test_loader = init_syft_workers()
init_blockchain()
