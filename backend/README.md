# 1. Create Virtual Environment

```$ python3 -m venv venv```

```$ source venv/bin/activate```

```$ pip install -r requirements.txt```

# 2. Running the back-end

In the ```flask_app``` directory, run ```flask run```


# 3. Uploading files to server

In the event that the front-end is not yet working, 

``` $ curl -F 'model_file=@/path/to/net.py' http://localhost:5000/api/upload```

Assuming the back-end started on port 5000.

**Note**: To test that this works, run this in a separate terminal in a folder away from the back-end code


# 4. Downloading trained model from server

In the event that the front-end is not yet working,

```$ curl http://localhost:5000/api/download --output model.pt```

Assuming the back-end started on port 5000. 

**Note**: To test that this works, run this in a separate terminal in a folder away from the back-end code

# Making changes

If you introduce a new dependency, please add it to the requirements.txt file, so everyone else using it can update their own virtual environments. 