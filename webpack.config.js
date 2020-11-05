const { resolve } = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { name } = require("./package.json")

module.exports = {
   entry: resolve(__dirname, 'src/index.js'),
   output: {
      path: resolve(__dirname, 'dist'),
      filename: name + '.js'
   },
   plugins: [
        new UglifyJsPlugin({
         exclude: [/\.min\.js$/gi] // skip pre-minified libs
      }),
          // make sure to include the plugin!
          new VueLoaderPlugin()
    ],
   module: {
      rules: [
         {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-object-rest-spread']
               }
            }
         },
         {
            test: /\.vue$/,
            loader: 'vue-loader'
         }
      ]
   }
}
