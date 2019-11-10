function generateAddress() {
	let secp256k1 = ecurve.getCurveByName('secp256k1')
	let randombytes = randomBytes(32).toString('hex')
	let privateKey = Buffer.from(randombytes, 'hex')

	console.log("私钥:" + privateKey.toString('hex'))
	let ecparams = ecurve.getCurveByName('secp256k1')
	let curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey))
	let x = curvePt.affineX.toBuffer(32)
	let y = curvePt.affineY.toBuffer(32)

	let publicKey = Buffer.concat([Buffer.from([0x04]), x, y])
	// console.log("标准地址:" + publicKey.toString('hex'))

	//compressed
	publicKey = curvePt.getEncoded(true) //true forces compressed public key
	console.log("压缩公钥 :" + publicKey.toString('hex'))


	let sha = crypto.createHash('sha256').update(publicKey).digest()
	let pubkeyHash = crypto.createHash('rmd160').update(sha).digest()

	// pubkeyHash of compressed public key
	// console.log("pubkeyHash:" + pubkeyHash.toString('hex')) 

	let address = cs.encode(pubkeyHash, 0x0)
	// address of compressed public key
	console.log("压缩地址：" + address) //<-- 0x0 is for public addresses
	//校验和Base58编码
	// let private_key2 = cs.encode(privateKey, 0x80) // private_key2 have some problem
	// console.log(private_key2) //<--- 0x80 is for private addresses

	let private_key = cs.encode(Buffer.concat([privateKey, new Buffer([0x01])]), 0x80)
	console.log("压缩私钥：" + private_key) // <-- compressed private address
	return [address, publicKey.toString('hex'), private_key]
}

module.exports = {
	generateAddress
}