const DamiCoin = artifacts.require("DamiCoin");

module.exports = function (deployer) {
    const initialSupply = 1000000;  
    deployer.deploy(DamiCoin, initialSupply);
};