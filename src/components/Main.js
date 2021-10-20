import React, { Component } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import './App.css';

class Main extends Component {
    render() {
        return (
            <div id="content" className="mt-3">

                <div className="d-flex justify-content-between mb-3">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                            this.props.setCurrentState({ currentForm: 'buy' })
                        }}
                    >
                        Buy
                    </button>
                    <span className="text-muted">&lt; &nbsp; &gt;</span>
                    <button
                        className="btn btn-light"
                        onClick={() => {
                            this.props.setCurrentState({ currentForm: 'sell' })
                        }}
                    >
                        Sell
                    </button>
                </div>

                <div className="card mb-4" >

                    <div className="card-body">
                        {this.props.currentForm === 'buy' ?
                            <BuyForm ethBalance={this.props.ethBalance} tokenBalance={this.props.tokenBalance} buyTokens={this.props.buyTokens} />
                            :
                            <SellForm ethBalance={this.props.ethBalance} tokenBalance={this.props.tokenBalance} sellTokens={this.props.sellTokens} />}
                    </div>

                </div>

            </div>
        );
    }
}

export default Main;
