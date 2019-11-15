function createUser(contract, privateKey, addr, username, pwd) {
    return new Promise((resolve, reject) => {
    	console.log("create user", addr)
        contract.methods.isExitUserAddress(addr).call().then(res => {
          console.log("Is the user created ?", res);
          if (!res) {
                const loginFun = contract.methods.createUser(addr, username, pwd);
                const logABI = loginFun.encodeABI();
                packSendMsg(addr, privateKey, contractAddress, logABI).then(receipt => {                        
                    console.log("rece", receipt)
                    if (receipt) {
                        console.log("Create the user success");
                        const eventJsonInterface = contract._jsonInterface.find(
                          o => (o.name === 'CreateUser') && o.type === 'event');
                        if (JSON.stringify(receipt.logs) != '[]') {
                          const log = receipt.logs.find(
                            l => l.topics.includes(eventJsonInterface.signature)
                          );
                          let decodeLog = Web3EthAbi.decodeLog(eventJsonInterface.inputs, log.data, log.topics.slice(1))
                            console.log(decodeLog)
                            resolve(receipt);
                        } else {
                          resolve(false);
                        }
                    }  else {
                      resolve(false);
                    }              
                }).catch(err => {
                  reject(err);
                  console.log(22333)
                });
          } else {
              resolve("This address or user name already register");
          };
        });
   });
}
// First, judge whether user register
// If user already register, login directly
// Or, the user must login firstly.
function login(contract, privateKey, addr, username, pwd) {
	return new Promise((resolve, reject) => {
  	    contract.methods.isExitUserAddress(addr).call().then(res => {
			if (res) {
				// console.log("Find:", res);
				const loginFun = contract.methods.login(addr, username, pwd);
		        const logABI = loginFun.encodeABI();
		        packSendMsg(addr, privateKey, contractAddress, logABI).then(receipt => {        			        	
		        	if (receipt) {
		        		console.log("Login success");
		        		const eventJsonInterface = contract._jsonInterface.find(
							o => (o.name === 'LoginEvent') && o.type === 'event');
						if (JSON.stringify(receipt.logs) != '[]') {
							const log = receipt.logs.find(
								l => l.topics.includes(eventJsonInterface.signature)
							)
							let decodeLog = Web3EthAbi.decodeLog(eventJsonInterface.inputs, log.data, log.topics.slice(1))
			   				console.log(decodeLog)
			   				resolve(decodeLog);
						} else {
							resolve(false);
						}
		        	}  else {
						resolve(false);
					}
					
				}).catch(err => {
					console.log("Already login in");
					reject(err);
				});
			} else {
				console.log("Not find the user,it will directly create the user!");
				const createFunc = contract.methods.createUser(addr, username, pwd);
				const createABI = createFunc.encodeABI();
				packSendMsg(addr, privateKey, contractAddress, createABI).then((receipt, rej) => {
					console.log("Success create the user");
					if (receipt.status) {
						const loginFun = contract.methods.login(addr, username, pwd);
				        const logABI = loginFun.encodeABI();
				        packSendMsg(addr, privateKey, contractAddress, logABI).then(receipt => {        			        	
				        	if (receipt) {
				        		console.log("Login success");
				        		const eventJsonInterface = contract._jsonInterface.find(
									o => (o.name === 'LoginEvent') && o.type === 'event');
								if (JSON.stringify(receipt.logs) != '[]') {
									const log = receipt.logs.find(
										l => l.topics.includes(eventJsonInterface.signature)
									)
									let decodeLog = Web3EthAbi.decodeLog(eventJsonInterface.inputs, log.data, log.topics.slice(1))
					   				console.log(decodeLog)
					   				resolve(decodeLog);
								} else {
									resolve(false);
								}
				        	}  else {
								resolve(false);
							}
							
						}).catch(err => {
							console.log("Already login in");
							reject(err);
						});
					} else {
						reject(rej);
					}
				});				
			}
		});
    });
}