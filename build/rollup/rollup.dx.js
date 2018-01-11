const path=require('path');
let root=path.resolve(__dirname,'../../');
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
var argv=require('yargs').boolean('ug').argv;
export default {
    //默认情况下，模块的上下文 - 即顶级的this的值为undefined。在极少数情况下，您可能需要将其更改为其他内容，如 'window'。
   // context:'window',
   //context:path.resolve(root,'src/dx'),
   //  moduleContext:path.resolve(root,'src/dx'),,
    //这个包的入口点 (例如：你的 main.js 或者 app.js 或者 index.js)
    input: path.resolve(root,'src/dx/main.js'),
    output: {
      file:path.resolve(root, 'dist/dx/index-rollup.js'),
      /*
      amd – 异步模块定义，用于像RequireJS这样的模块加载器
    cjs – CommonJS，适用于 Node 和 Browserify/Webpack
    es – 将软件包保存为ES模块文件
    iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
    umd – 通用模块定义，以amd，cjs 和 iife 为一体
      */
      format: 'umd',
      //代表你的 iife/umd 包，同一页上的其他脚本可以访问它。
       name:"mjb", 
        //字符串以 前置/追加 到文件束(bundle)。(注意:“banner”和“footer”选项不会破坏sourcemaps)
        banner: '/* Project base tool library */',
      //  footer: "",//'/* Developer  @fanyonglong */',
         //String类似于 banner和footer，除了代码在内部任何特定格式的包装器(wrapper)
        intro: 'var __non_webpack_require__=require;',
     //   outro:"",
        sourcemap:false ,//如果 true，将创建一个单独的sourcemap文件。如果 inline，sourcemap将作为数据URI附加到生成的output文件中。
        amd: {
           // id: 'my-bundle'
        },
        globals:{
            jquery:'$'
        },
        strict:true,
        /**
         * Function，它获取一个ID并返回一个路径，或者id：path对的Object。在提供的位置，这些路径将被用于生成的包而不是模块ID，从而允许您（例如）从CDN加载依赖关系：
         * 
        */
        paths:{
                "element-ui":"ELEMENT"
        }
    },
    plugins:[alias({
    }),replace({
      //  include: 'main.js',
        exclude: 'node_modules/**',
        delimiters:['',''],
        "process.env.globalvar": JSON.stringify('mjb')
    //     values: {
    //         VERSION: '1.0.0',
    //         process: {
    //             env:{
    //                 'NODE_ENV': JSON.stringify('dev'),
    //                 'globalvar':JSON.stringify('mjb')
    //             }
    //         }
    //    }     
    }),babel(
        {
            babelrc:false,
            presets:[['env',{
                    targets:{
                    //    chrome:50
                    },
                  modules: false
                    
            }]],
            exclude: 'node_modules/**' // 只编译我们的源代码
        }
    )],
    external:['lodash','jquery','vue','element-ui']
    
};