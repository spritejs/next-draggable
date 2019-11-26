const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    demo: './examples/demo.js'
  },
  output: {
    path: path.resolve(__dirname, '/'),
    filename: '[name].js',
    library: 'spriteDraggable',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {
    spritejs: 'spritejs'
  },
  devServer: {
    contentBase: path.join(__dirname, 'examples'),
    open: true
    //hot: true
    //compress: true
    //port: 9000
  }
}
