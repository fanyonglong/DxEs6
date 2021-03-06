const merge = require('webpack-merge');
const common = require('./webpack.common');
const MinifyPlugin=require('babel-minify-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack=require('webpack')
const fs=require('fs')
const path=require('path')

const dir=path.resolve(__dirname,'../','src/es6');
var files=fs.readdirSync(dir,{
    encoding:"utf8"
});
var entryFiles={
   polyfill:'babel-polyfill'
};   //{['babel-polyfill']:'babel-polyfill'};
files.forEach((file)=>{
    
    entryFiles[path.basename(file,'.js')]='./src/es6/'+file;
});
//cls
common.plugins=[]
common.entry={};
common.module={};
console.log(entryFiles);
module.exports ={
 //   devtool: 'inline-source-map',
    entry:entryFiles,
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        libraryTarget: "umd",
        path: path.resolve(__dirname, '../dist/es6'),
    },
    module: {
       // noParse: /jquery|vue|lodash/,
        rules: [
              {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                  },
                  {
                      test:/\.js$/,
                      exclude: /(node_modules|bower_components)/,
                      use:{
                            loader:'babel-loader',
                            options:{
                                
                            //     babelrc:false,
                            //   //  plugins:['syntax-jsx'],
                            //     presets:[['env',{
                            //         targets:{
                            //             "browsers": ["last 3 versions"]
                            //         }
                            //       //  useBuiltIns:true
                            //     }]],
                            //     // plugins:[['transform-runtime',{
                            //     //     "helpers":false, //boolean，默认为true。
                            //     //     "polyfill": true,
                            //     //     "regenerator": true,
                            //     //     "moduleName": "babel-runtime"
                            //     // }],'transform-object-rest-spread','transform-class-properties']
                            //     plugins:['transform-object-rest-spread','transform-class-properties','transform-decorators'] //'transform-runtime'
                            //   //  plugins:['transform-es2015-typeof-symbol']
                            }
                      }
                  }
                ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/es6'],{
            root: path.resolve(__dirname,'../')
        }),
        new webpack.optimize.CommonsChunkPlugin({
             //   names:['babel-polyfill'].concat(Object.keys(entryFiles)),
               name: 'common', // 指定公共 bundle 的名称。
               // chunks:['babel-polyfill'] // 过滤
        }),
         new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev')
            }
        })
   ] 
}
