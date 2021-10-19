import React, { Component } from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: '0'
    };
  }

  componentWillMount() {
    this.loadWeb3();
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }

  render() {
    console.log(this.state.account);
    console.log(this.state.ethBalance);
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
