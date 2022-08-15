const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        })],
    },
    mode: 'production',
};