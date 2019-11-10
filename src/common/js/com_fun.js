export const Configuration = {
  ServerName: "localhost",
  ServerPort: "8080"
}

exports.packOpt = (requestPath) => {
    let header = {
            'Content-Type': 'application/json'
    };
    let options = {
      hostname: Configuration.ServerName,
      port: Configuration.ServerPort,
      path: requestPath,
      method: "GET",
      headers: header
    };
    return options;
}