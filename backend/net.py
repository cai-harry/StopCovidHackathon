import torch
import torch.nn as nn
import torch.nn.functional as F

# Model is the same as the reference one
# NOTE: This file is just placed here as a reference 
# to run the back-end. You may place it in a random folder 
# and try uploading it to the server, following the README instructions

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(62, 64)
        self.fc2 = nn.Linear(64, 16)
        self.fc3 = nn.Linear(16, 1)
        self.dropout = nn.Dropout(p=0.25)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = torch.sigmoid(self.fc3(x))
        return x.squeeze()
