const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    library: 'nextDraggable',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {
    spritejs: 'spritejs'
  },
  devServer: {
    contentBase: path.join(__dirname, 'examples'),
    hot: true
  }
}
