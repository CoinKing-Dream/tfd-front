const ansiRegex = require('ansi-regex');

module.exports = {
  transpileDependencies: [ansiRegex],
  devServer: {
    // port: 8888,
    // disableHostCheck: true,
    proxy: {
      "^/api/": {
        target: process.env.USE_LOCAL_SERVER
          ? "http://localhost:3000"
          : "http://localhost:8080",
        ws: true,
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: "./srv"
    }
  },

  runtimeCompiler: true,

  css: {
    sourceMap: true
  },
  productionSourceMap: false,
};
