import React, { Component } from 'react';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      tokenBalance: '0',
      ethBalance: '0',
      currentForm: 'buy',
      loading: true
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

    // Load Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance });
    } else {
      window.alert("Token contract not deployed to detected network");
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network");
    }

    this.setState({ loading: false });
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

  buyTokens = (ethAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens().send({ from: this.state.account, value: ethAmount }).on('transactionHash', () => {
      this.loadBlockchainData();
    });
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap._address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.loadBlockchainData();
      });
    });
  }

  setCurrentState = (state) => {
    this.setState(state);
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: "600px" }}>
              <div className="content mr-auto ml-auto">
                {this.state.loading ?
                  <p id="loader" className="text-center">loading</p>
                  :
                  <Main
                    ethBalance={this.state.ethBalance}
                    tokenBalance={this.state.tokenBalance}
                    buyTokens={this.buyTokens}
                    sellTokens={this.sellTokens}
                    setCurrentState={this.setCurrentState} 
                    currentForm={this.state.currentForm}/>
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
