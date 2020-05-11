# Create Virtual Environment

Option A
```
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

Option B (endorsed by @cai-harry: set up with VSCode)
```
conda create -n hack
activate hack
conda install pytorch==1.4.0 torchvision -c pytorch
pip install -r requirements.txt
```

# Compiling the smart contract

Download [Truffle](https://www.trufflesuite.com/truffle)
 
```
npm install truffle -g
```

From repo root:
```
truffle build
```

It should create a file `build/contracts/Contributions.json` and `build/contracts/Migrations.json`.

# Setting up the blockchain

Download [Ganache](https://www.trufflesuite.com/ganache).

Fire it up. Create a new workspace or use quick start.

Check that the RPC server is running on `http://127.0.0.1:7545` (this is the default)

# Running the back-end

In the ```flask_app``` directory, run ```flask run```


# Uploading files to server

In the event that the front-end is not yet working, 

``` $ curl -F 'model_file=@/path/to/net.py' http://localhost:5000/api/upload```

Assuming the back-end started on port 5000.

**Note**: To test that this works, run this in a separate terminal in a folder away from the back-end code


# Downloading trained model from server

In the event that the front-end is not yet working,

```$ curl http://localhost:5000/api/download --output model.pt```

Assuming the back-end started on port 5000. 

**Note**: To test that this works, run this in a separate terminal in a folder away from the back-end code

# Making changes

If you introduce a new dependency, please add it to the requirements.txt file, so everyone else using it can update their own virtual environments. 