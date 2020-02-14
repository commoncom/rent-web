let Wallet = require('ethereumjs-wallet');
exports.generateAddress = () => {
	const wallet = Wallet.generate();
	let address = wallet.getAddressString();
	let prikey = wallet.getPrivateKeyString();
	console.log("privateKey: " + prikey);
	console.log("address: " + address);
    return [address, prikey];
}
