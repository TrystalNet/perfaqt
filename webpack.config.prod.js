var webpack = require('webpack')

module.exports = {
  entry: './src/index',
  resolve:{extensions:['','.js']},
  output: {filename: './dist/bundle.js'},
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
  ],
  module:{
      loaders:[
          { 
              test: /\.js$/, 
              exclude: /node_modules/, 
              loader: 'babel-loader'
            }
      ]
  }
}
