import React, { Component } from 'react';
import axios from 'axios';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import Web3 from 'web3'


const getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion before loading web3, to be sure it's
  // already injected
  window.addEventListener('load', function() {
    var results
    var web3 = window.web3
    // Checking if Web3 has been injected by the browser MetaMask
    if (typeof web3 !== 'undefined') {
      // Use MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      results = {
        web3: web3
      }
      console.log('Injected web3 detected.');
      resolve(results)
    } else {
      // If no web3 is detected, then the local web3 provider is loaded.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
      web3 = new Web3(provider)
      results = {
        web3: web3
      }
      console.log('No web3 instance injected, using Local web3.');
      resolve(results)
    }
  })
});


class UploadScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      training: false,
      training_completed: false,
      web3: null
    }
  }


  componentDidMount() {
    getWeb3.then(w => {
      console.log(w);
      this.setState((state) => {
        return {web3: w}
      });
      console.log(this.state);
    })
  }

  checkMimeType = (event) => {
    let file = event.target.files[0];
    let err = '';
    const expected_type = 'text/x-python';
    if (file.type !== expected_type) {
      err = file.type + ' is not a supported format!';
      console.log(err);
      store.addNotification({
        title: 'Upload Failed',
        message: err,
        type: 'danger',
        container: 'bottom-center',
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000
        }
      })
    }

    if (file.name !== 'net.py') {
      err = file.name + ' is not valid. Should be net.py';
      console.log(err);
      store.addNotification({
        title: 'Upload Failed',
        message: err,
        type: 'danger',
        container: 'bottom-center',
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000
        }
      })
    }

    if (err !== '') {
      event.target.value = null;
      return false;
    }

    return true;
  }

  onChangeHandler = event => {
    if (this.checkMimeType(event)) {
      this.setState({
        selectedFile: event.target.files[0],
      });
    }
  }

  onDLClickHandler = () => {

    fetch("http://localhost:5000/api/download")
      .then((res) => {
        res.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'model.pt';
          a.click()
        });
        // FileDownload(res.data, 'model.pt');

        this.setState({
          training_completed: false,
          training: false,
        });

      });
  }

  onClickHandler = () => {

    store.addNotification({
      title: 'Upload successful',
      message: 'The model will now be trained. A download link and metrics will be available on completion',
      type: 'success',
      container: 'bottom-center',
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 10000
      }
    })

    this.setState({
      training: true,
    });

    const data = new FormData();
    data.append('model_file', this.state.selectedFile);

    let accuracy;
    let contrib_a;
    let contrib_b;
    let contrib_c;

    axios.post("http://localhost:5000/api/upload", data, {})
      .then(
        res => {
          //TODO: Replace with charts
          console.log(res.statusText);
          accuracy = res.data.accuracy;
          contrib_a = res.data.contrib_a;
          contrib_b = res.data.contrib_b;
          contrib_c = res.data.contrib_c;

          store.addNotification({
            title: 'Results Available',
            message: 'Accuracy: ' + accuracy + '; Respective contributions: ' + contrib_a + '%, ' + contrib_b + '%, ' + contrib_c + '%.',
            type: 'info',
            container: 'bottom-center',
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000
            }
          })

          this.setState({
            training_completed: true,
          });
        }
      );
  }

  renderUploadButton = () => {
    if (!this.state.training) {
      return (
        <button type="button" className="button" onClick={this.onClickHandler}>
          Upload
        </button>
      );
    }
  }

  renderDownloadButton = () => {
    if (this.state.training_completed) {
      return (
        <button type="button" className="button2" onClick={this.onDLClickHandler}>
          Download
        </button>
      )
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="offset-md-3 col-md-6">

            <div className="form-group files">
              <label>Upload File containing your model (net.py) </label>
              <input type="file" name="file" onChange={this.onChangeHandler} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.renderUploadButton()}
          {this.renderDownloadButton()}
        </div>
      </div>
    );
  }
}

export default UploadScreen;
