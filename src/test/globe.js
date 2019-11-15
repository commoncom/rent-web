app.get('/register/:address/:username/:pwd/:prikey', (req, res) => {
    console.log("-----get adddress params----", req.params)
    setResHeadr(res);
    contractReg.then(con => {
        RegisterFun.isAlreayReg().then(res => {
            if (!res) {
                contractToken.then(tocon => {
                  TokenFun.transferEth(tocon, comCos.regpri, comCos.regAddr, req.params.address, 20000000000*4200000).then(trans => {
                      console.log("start create the user");
                      RegisterFun.createUser(con, req.params.prikey, req.params.address,req.params.username, req.params.pwd).then(ctx => {
                        console.log(ctx)
                        if (ctx) { // Already sign
                          res.send({
                            "status": ctx.status,
                            "txHash": ctx.transactionHash
                          });
                        }
                      }).catch(err => {
                        console.log(222, err)
                        res.send({
                          "status": false,
                          "err": err
                        });
                      });
                  }).catch(err => {
                      res.send({
                        "status": false,
                        "err": err
                      });
                  });
              }).catch(err => {
                  res.send({
                    "status": false,
                    "err": err
                  });
              });
            }
        });
        
      }).catch(err => {
        res.send({
          "status": false,
          "err": err
        });
      });
    
  });