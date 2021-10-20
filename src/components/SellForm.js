import React, { Component } from 'react';
import ethLogo from '../eth-logo.png';
import tokenLogo from '../token-logo.png';
import './App.css';

class BuyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '0'
        }
    }

    render() {
        return (
            <form className="mb-3" onSubmit={(e) => {
                e.preventDefault();
                this.props.sellTokens(window.web3.utils.toWei(this.state.value, 'ether'));
            }}>
                <div>
                    <label className="float-left"><b>Input</b></label>
                    <span className="float-right text-muted">
                        Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'ether')}
                    </span>
                </div>
                <div className="input-group mb-4">
                    <input
                        type="text"
                        onChange={(e) => this.setState({ value: e.target.value })}
                        className="form-control form-control-lg"
                        placeholder="0"
                        required />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={tokenLogo} height='32' alt="" />
                            &nbsp; DApp
                        </div>
                    </div>
                </div>
                <div>
                    <label className="float-left"><b>Output</b></label>
                    <span className="float-right text-muted">
                        Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'ether')}
                    </span>
                </div>
                <div className="input-group mb-2">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="0"
                        value={this.state.value / 100}
                        disabled
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <img src={ethLogo} height='32' alt="" />
                            &nbsp;&nbsp;&nbsp; ETH 
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <span className="float-left text-muted">Exchange Rate</span>
                    <span className="float-right text-muted">100 DApp = 1 ETH</span>
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
            </form>
        );
    }
}

export default BuyForm;
