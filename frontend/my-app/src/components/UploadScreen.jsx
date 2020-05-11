import React, { Component } from 'react';
import axios from 'axios';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

import { default as Web3} from 'web3';
import Federated from "../Contributions.json"


class UploadScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      training: false,
      training_completed: false,
      web3: null,
      federatedContract: null
    }
  }

  async  loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    this.setState({
      web3: window.web3
    })
  }

  async  loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Federated.networks[networkId]
    if(networkData) {
      const federated = new web3.eth.Contract(Federated.abi, networkData.address)
      console.log(federated)
      this.setState({
        federatedContract: federated
      })
    } else {
      window.alert('Contract not deployed to detected network.')
    }
  }

  // async componentWillMount() {
  async componentDidMount() {

    await this.loadWeb3()
    await this.loadBlockchainData()

  }

  hasElement = (array, value) => {
    return array.indexOf( value ) !== -1;
  };

  checkMimeType = (event) => {
    let file = event.target.files[0];
    let err = '';
    const expected_types = ['text/plain', 'text/x-python'];
    if (! this.hasElement(expected_types, file.type)) {
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

      }).catch(error => {
        store.addNotification({
          title: 'Server Error',
          message: 'There is a problem with the back-end server that prevented the request from being completed',
          type: 'danger',
          container: 'bottom-center',
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 15000
          }
        })
      });
  }

  onClickHandler = async () => {

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

    const currentWeb3 = this.state.web3;

    const valueToSend = currentWeb3.utils.toWei("1", 'Ether');
    const accounts = await currentWeb3.eth.getAccounts();
    const federatedContract = this.state.federatedContract.methods;

    const reader = new FileReader();

    reader.onload = function () {
      const hexContent = currentWeb3.utils.toHex(reader.result);
      const hashResult = currentWeb3.utils.soliditySha3(hexContent);
      console.log(hashResult);

      federatedContract.request_training(hashResult)
          .send( {from: accounts[0], value: valueToSend} )
          .catch(err => console.log("Error ", err));

    };
    reader.readAsBinaryString(this.state.selectedFile)


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
          });

          this.setState({
            training_completed: true,
          });
        }
      ).catch(error => {
        store.addNotification({
          title: 'Server Error',
          message: 'There is a problem with the back-end server that prevented the request from being completed',
          type: 'danger',
          container: 'bottom-center',
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 15000
          }
        });
      });
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
