var webpack = require('webpack')

module.exports = {
  resolve:{extensions:['','.js','.jsx']},
  entry: './src/index.jsx',
  output: {filename: './dist/bundle.js'},
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
  ],
  module:{
      loaders:[{ 
            test: /\.jsx?$/, 
            exclude: /node_modules/, 
            loader: 'babel-loader'
        }
     ]
  }
}
