const merge = require('webpack-merge');
const common = require('./webpack.common');
const MinifyPlugin=require('babel-minify-webpack-plugin')
const webpack=require('webpack')

module.exports = merge(common, {
 //   devtool: 'inline-source-map',
    entry: {
        index:'./src/index.js',
      //  common:['lodash','vue'],
   },
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].bundle.js',
        libraryTarget: "umd"
    },
  //  externals:['lodash','vue'],
    // externals:{
    //     lodash:{
    //         commonjs: "lodash",
    //         amd: "lodash",
    //         root:'_'
    //     }
    // },
    devServer: {
     contentBase: '../dist'
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //          name: 'common', // 指定公共 bundle 的名称。
        //          names: ["index"],
        //          minChunks: 2
        // }),
         new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev')
            }
        })
   ] 
});
