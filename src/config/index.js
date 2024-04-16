const confs = {
    development: {
      apiServer: {
        url: "http://18.177.39.68"
      }
    },
    staging: {
      apiServer: {
        url: window.location.origin
      }
    },
    production: {
      apiServer: {
        url: window.location.origin
      }
    }
  },
  staticConf = {
    tileServer: {
      url: "https://cyberjapandata.gsi.go.jp"
    },
    staticServer: {
      url: "https://s3-ap-northeast-1.amazonaws.com"
    },
    dataServer: {
      url: "http://153.122.172.51"
    }
  },
  env = require("./current.config"),
  current = env.current
  delete env.current

console.log("env", current);
module.exports = Object.assign(staticConf, env.custom? env.custom : confs[current]);
