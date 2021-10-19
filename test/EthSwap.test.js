const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai').use(require('chai-as-promised')).should();

const tokens = (n) => {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap;

    before(async () => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        // Transfer all tokens to EtSwap (1 million)
        await token.transfer(ethSwap.address, tokens('1000000'));
    })


    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name();
            assert.equal(name, 'DApp Token');
        })
    })

    describe('EhtSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })

    describe('buyTokens()', async () => {
        let result;
        before(async () => {
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') });
        })

        it('Allows users to instantly purchase tokens from ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let invertorBalance = await token.balanceOf(investor);
            assert.equal(invertorBalance.toString(), tokens('100'));

            // Check ethSwap balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('999900'));
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'));

            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        })
    })

    describe('sellTokens()', async () => {
        let result;
        before(async () => {
            // Investor must approve tokens before the purchase
            await token.approve(ethSwap.address, tokens('100'), { from: investor });
            // Investor sells tokens
            result = await ethSwap.sellTokens(tokens('100'), { from: investor });
        })

        it('Allows users to instantly sell tokens to ethSwap for a fixed price', async () => {
            // Check investor token balance after purchase
            let invertorBalance = await token.balanceOf(investor);
            assert.equal(invertorBalance.toString(), tokens('0'));

            // Check ethSwap balance after purchase
            let ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('1000000'));
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'));

            // Check logs to ensure event was emitted with correct data
            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100'));
            assert.equal(event.rate.toString(), '100');
        })
    })
})