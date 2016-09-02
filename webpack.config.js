var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  resolve:{extensions:['','.js','.jsx']},
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        loaders: ['react-hot','babel-loader']
    }]
  }
};
