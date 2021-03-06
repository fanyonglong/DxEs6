# DxEs6
## ES6 开发编译环境
- [webpack 编译](#安装编译环境)
- [webpack node编译](#node编译)
- [webpack 命令行编译](#命令行编译)
- [webpack plugins](#innerPlugin)
- [wepack loader](#loader) 
- [compile](#compile)
- [hot development](#模块热替换)
- [babel-core](#babel-core)
- [VSCODE](#VSCODE)

### 安装编译环境  [webpack](https://doc.webpack-china.org/)
npm install -g nodemon  [自动重启](#https://www.npmjs.com/package/nodemon)
npm install webpack  --save-dev  [编译](https://www.npmjs.com/package/webpack)
npm install webpack-merge  --save-dev  [配置合并](https://www.npmjs.com/package/webpack-merge)   
 
#### [node编译](#https://doc.webpack-china.org/api/node/#-installation-)
安装(Installation)
开始使用 webpack 的 Node.js API 之前，首先你需要安装 webpack：
```bash
npm install --save-dev webpack
```
然后在 Node.js 脚本中 require webpack module：
```javascript
const webpack = require("webpack");
// 或者如果你喜欢 ES2015:
import webpack from "webpack";
```
webpack()
导入的 webpack 函数需要传入一个 webpack 配置对象，当同时传入回调函数时就会执行 webpack compiler：
```javascript
const webpack = require("webpack");

webpack({
  // 配置对象
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
});
```
编译错误不在 err 对象内，而是需要使用 stats.hasErrors() 单独处理，你可以在指南的 错误处理 部分查阅到更多细节。err 对象只会包含 webpack 相关的问题，比如配置错误等。
**注意** 你可以传入一个配置选项数组到 webpack 函数内：
```javascript
webpack([
  { /* 配置对象 */ },
  { /* 配置对象 */ },
  { /* 配置对象 */ }
], (err, stats) => {
  // ...
});
```
Compiler 实例(Compiler Instance)
如果你不向 webpack 执行函数传入回调函数，就会得到一个 webpack Compiler 实例。你可以通过它手动触发 webpack 执行器，或者是让它执行构建并监听变更。和 CLI API 很类似。Compiler 实例提供了以下方法：
- `.run(callback)`
- `.watch(watchOptions, handler)`

#### 执行(Run)
调用 Compiler 实例的 run 方法跟上文提到的快速执行方法很相似：
```javascript
const webpack = require("webpack");

const compiler = webpack({
  // 配置对象
});

compiler.run((err, stats) => {
  // ...
});
```
#### 监听(Watching)
调用 watch 方法会触发 webpack 执行器，但之后会监听变更（很像 CLI 命令: webpack --watch），一旦 webpack 检测到文件变更，就会重新执行编译。该方法返回一个 Watching 实例。
```javascript
watch(watchOptions, callback)
const webpack = require("webpack");

const compiler = webpack({
  // 配置对象
});

const watching = compiler.watch({
  /* watchOptions */
}, (err, stats) => {
  // 在这里打印 watch/build 结果...
  console.log(stats);
});
```
Watching [配置选项的细节可以在这里查阅](#https://doc.webpack-china.org/configuration/watch/#watchoptions)。

文件系统不正确的问题，可能会对单次修改触发多次构建。因此，在上面的示例中，一次修改可能会多次触发 console.log 语句。用户应该预知此行为，并且可能需要检查 stats.hash 来查看文件哈希是否确实变更。
#### 关闭 Watching(Close Watching)
watch 方法返回一个 Watching 实例，它会暴露一个 .close(callback) 方法。调用该方法将会结束监听：
```javascript
watching.close(() => {
  console.log("Watching Ended.");
});
```
不允许在当前监听器已经关闭或失效前再次监听或执行。
#### 作废 Watching(Invalidate Watching)
使用 watching.invalidate，您可以手动使当前编译循环(compiling round)无效，而不会停止监视进程：
```javascript
watching.invalidate();
```
#### Stats 对象(Stats Object)
stats 对象会被作为 webpack() 回调函数的第二个参数传入，可以通过它获取到代码编译过程中的有用信息，包括：

- 错误和警告（如果有的话）
- 计时信息
- module 和 chunk 信息

webpack CLI 正是基于这些信息在控制台展示友好的格式输出。

When using the MultiCompiler, a MultiStats instance is returned that fulfills the same interface as stats, i.e. the methods described below.
stats 对象暴露了以下方法：

##### `stats.hasErrors()`
可以用来检查编译期是否有错误，返回 true 或 false。

##### `stats.hasWarnings()`
可以用来检查编译期是否有警告，返回 true 或 false。

##### `stats.toJson(options)`
以 JSON 对象形式返回编译信息。options 可以是一个字符串（预设值）或是颗粒化控制的对象：
```javascript
stats.toJson("minimal"); // 更多选项如: "verbose" 等.
stats.toJson({
  assets: false,
  hash: true
});
```
所有可用的配置选项和预设值都可查询 Stats 文档。

这里有一个该函数输出的示例

##### stats.toString(options)
以格式化的字符串形式返回描述编译信息（类似 CLI 的输出）。

配置对象与 stats.toJson(options) 一致，除了额外增加的一个选项：
```javascript
stats.toString({
  // ...
  // 增加控制台颜色开关
  colors: true
});
```
下面是 stats.toString() 用法的示例：
```javascript
const webpack = require("webpack");

webpack({
  // 配置对象
}, (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(stats.toString({
    chunks: false,  // 使构建过程更静默无输出
    colors: true    // 在控制台展示颜色
  }));
});
```
错误处理(Error Handling)
完备的错误处理中需要考虑以下三种类型的错误：

致命的 wepback 错误（配置出错等）
编译错误（缺失的 module，语法错误等）
编译警告
下面是一个覆盖这些场景的示例：
```javascript
const webpack = require("webpack");

webpack({
  // 配置对象
}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  // 记录结果...
});
```
#### 自定义文件系统(Custom File Systems)
默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘。但是，还可以使用不同类型的文件系统（内存(memory), webDAV 等）来更改输入或输出行为。为了实现这一点，可以改变 inputFileSystem 或 outputFileSystem。例如，可以使用 memory-fs 替换默认的 outputFileSystem，以将文件写入到内存中，而不是写入到磁盘：
```javascript
const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const fs = new MemoryFS();
const compiler = webpack({ /* options*/ });

compiler.outputFileSystem = fs;
compiler.run((err, stats) => {
  // 之后读取输出：
  const content = fs.readFileSync("...");
});
```
值得一提的是，被 webpack-dev-server 及众多其他包依赖的 webpack-dev-middleware 就是通过这种方式，将你的文件神秘地隐藏起来，但却仍然可以用它们为浏览器提供服务！
### 命令行编译

```bash
webpack lib/index.js dist/index-w.js --output-library HtmlParser2 --output-library-target umd --optimize-minimize
```


为了更合适且方便地使用配置，可以在 `webpack.config.js` 中对 webpack 进行配置。CLI 中传入的任何参数会在配置文件中映射为对应的参数。

如果你还没有安装 webpack，请查看[安装指南](/guides/installation)。

T> webpack 的新 CLI 正在开发中。正在添加新功能，例如 `--init` 参数。[查看详情！](https://github.com/webpack/webpack-cli)


## 使用配置文件的用法

```sh
webpack [--config webpack.config.js]
```

配置文件中的相关选项，请参阅[配置](/configuration)。


## 不使用配置文件的用法

```sh
webpack <entry> [<entry>] <output>
```

**`<entry>`**

一个文件名或一组被命名的文件名，作为构建项目的入口起点。你可以传递多个入口（每个入口在启动时加载）。如果传递一个形式为 `<name> = <request>` 的键值对，则可以创建一个额外的入口起点。它将被映射到配置选项(configuration option)的 `entry` 属性。

**`<output>`**

要保存的 bundled 文件的路径和文件名。它将映射到配置选项 `output.path` 和 `output.filename`。

**示例**

假设你的项目结构像下面这样：

```bash
.
├── dist
├── index.html
└── src
    ├── index.js
    ├── index2.js
    └── others.js
```

```bash
webpack src/index.js dist/bundle.js
```

打包源码，入口为 `index.js`，并且输出文件的路径为 `dist`，文件名为 `bundle.js`

```bash
	| Asset     | Size    | Chunks      | Chunk Names |
	|-----------|---------|-------------|-------------|
	| bundle.js | 1.54 kB | 0 [emitted] | index       |
	[0] ./src/index.js 51 bytes {0} [built]
	[1] ./src/others.js 29 bytes {0} [built]
```

```bash
webpack index=./src/index.js entry2=./src/index2.js dist/bundle.js
```

以多个入口的方式打包文件

```bash
	| Asset     | Size    | Chunks        | Chunk Names   |
	|-----------|---------|---------------|---------------|
	| bundle.js | 1.55 kB | 0,1 [emitted] | index, entry2 |
	[0] ./src/index.js 51 bytes {0} [built]
	[0] ./src/index2.js 54 bytes {1} [built]
	[1] ./src/others.js 29 bytes {0} {1} [built]
```


### 常用配置

**列出命令行所有可用的配置选项**

```bash
webpack --help
webpack -h
```

**使用配置文件进行构建**

指定其它的[配置](/configuration)文件。配置文件默认为 `webpack.config.js`，如果你想使用其它配置文件，可以加入这个参数。

```bash
webpack --config example.config.js
```

**以 JSON 格式输出 webpack 的运行结果**

```bash
webpack --json
webpack --json > stats.json
```

在其他每个情况下，webpack 会打印一组统计信息，用于显示 bundle, chunk 和用时等详细信息。使用此选项，输出可以是 JSON 对象。此输出文件(response)可被 webpack 的[分析工具](https://webpack.github.com/analyse)，或 chrisbateman 的 [webpack 可视化工具](https://chrisbateman.github.io/webpack-visualizer/)，或 th0r 的 [webpack bundle 分析工具](https://github.com/th0r/webpack-bundle-analyzer)接收后进行分析。分析工具将接收 JSON 并以图形形式提供构建的所有细节。

### 环境选项

当 webpack 配置对象[导出为一个函数](/configuration/configuration-types#exporting-a-function)时，可以向起传入一个"环境对象(environment)"。

```bash
webpack --env.production    # 设置 env.production == true
webpack --env.platform=web  # 设置 env.platform == "web"
```

`--env` 参数具有多种语法 accepts various syntaxes:

Invocation                               | Resulting environment
---------------------------------------- | ---------------------------
`webpack --env prod`                     | `"prod"`
`webpack --env.prod`                     | `{ prod: true }`
`webpack --env.prod=1`                   | `{ prod: 1 }`
`webpack --env.prod=foo`                 | `{ prod: "foo" }`
`webpack --env.prod --env.min`           | `{ prod: true, min: true }`
`webpack --env.prod --env min`           | `[{ prod: true }, "min"]`
`webpack --env.prod=foo --env.prod=bar`  | `{prod: [ "foo", "bar" ]}`

T> See the [environment variables](/guides/environment-variables) guide for more information on its usage.

### 输出配置

通过以下这些配置，你可以调整构建流程的某些[输出](/configuration/output)参数。

参数 | 说明 | 输入类型 | 默认值
------------------------- | ------------------------------------------- | ---------- | ------------------
`--output-chunk-filename` | 输出的附带 chunk 的文件名   | string     | 含有 [id] 的文件名，而不是 [name] 或者 [id] 作为前缀
`--output-filename`       | 打包文件的文件名           | string     | [name].js
`--output-jsonp-function` | 加载 chunk 时使用的 JSONP 函数名 | string | webpackJsonp
`--output-library`        | 以库的形式导出入口文件 | string |
`--output-library-target` | 以库的形式导出入口文件时，输出的类型 | string | var
`--output-path`           | 输出的路径（在公共路径的基础上）      | string     | 当前目录
`--output-pathinfo`       | 加入一些依赖信息的注解 | boolean | false
`--output-public-path`    | The 输出文件时使用的公共路径              | string     | /
`--output-source-map-filename` | 生成的 SourceMap 的文件名  | string     | [name].map or [outputFilename].map


#### 示例用法

```bash
webpack index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js'

| Asset                                | Size    | Chunks      | Chunk Names   |
|--------------------------------------|---------|-------------|---------------|
| index2740fdca26e9348bedbec.bundle.js |  2.6 kB | 0 [emitted] | index2        |
| index740fdca26e9348bedbec.bundle.js  | 2.59 kB | 1 [emitted] | index         |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```

```bash
webpack.js index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js' --devtool source-map --output-source-map-filename='[name]123.map'

| Asset                                | Size    | Chunks      | Chunk Names   |
|--------------------------------------|---------|-------------|---------------|
| index2740fdca26e9348bedbec.bundle.js | 2.76 kB | 0 [emitted] | index2        |
|  index740fdca26e9348bedbec.bundle.js | 2.74 kB | 1 [emitted] | index         |
|                        index2123.map | 2.95 kB | 0 [emitted] | index2        |
|                         index123.map | 2.95 kB | 1 [emitted] | index         |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```


### Debug 配置

以下这些配置可以帮助你在 Webpack 编译过程中更好地 debug。

参数 | 说明 | 输入类型 | 默认值
------------ | ------------------------------------------------ | ---------- | -------------
`--debug`    | 把 loader 设置为 debug 模式 | boolean    | false
`--devtool`  | 为打包好的资源定义 [source map 的类型] | string | -
`--progress` | 打印出编译进度的百分比值 | boolean    | false
`--display-error-details` | 展示错误细节 | boolean | false

### 模块配置

这些配置可以用于绑定 Webpack 允许的[模块](/configuration/module/)。

参数 | 说明 | 用法
-------------------- | ---------------------------------- | ----------------
`--module-bind`      | 为 loader 绑定一个扩展 | `--module-bind js=babel-loader`
`--module-bind-post` | 为 post loader 绑定一个扩展 |
`--module-bind-pre`  | 为 pre loader 绑定一个扩展 |


### Watch 配置

这些配置可以用于[观察](/configuration/watch/)依赖文件的变化，一旦有变化，则可以重新执行构建流程。

参数 | 说明
------------------------- | ----------------------
`--watch`, `-w`           | 观察文件系统的变化
`--watch-aggregate-timeout` | 指定一个毫秒数，在这个时间内，文件若发送了多次变化，会被合并
`--watch-poll`            | 轮询观察文件变化的时间间隔（同时会打开轮询机制）
`--watch-stdin`, `--stdin` | 当 stdin 关闭时，退出进程


### 性能优化配置

在生产环境的构建时，这些配置可以用于调整的一些性能相关的配置。

参数 | 说明 | 使用的插件
--------------------------- | -------------------------------------------------------|----------------------
`--optimize-max-chunks`     | 限制 chunk 的数量 | [LimitChunkCountPlugin](/plugins/limit-chunk-count-plugin)
`--optimize-min-chunk-size` | 限制 chunk 的最小体积               | [MinChunkSizePlugin](/plugins/min-chunk-size-plugin)
`--optimize-minimize`       | 压缩混淆 javascript，并且把 loader 设置为 minimizing | [UglifyJsPlugin](/plugins/uglifyjs-webpack-plugin/) & [LoaderOptionsPlugin](/plugins/loader-options-plugin/)


### Resolve 配置

这些配置可以用于设置  webpack [resolver](/configuration/resolve/) 时使用的别名(alias)和扩展名(extension)。

参数   | 说明                      | 示例
---------------------- | ------------------------------------------------------- | -------------
--resolve-alias        | 指定模块的别名 | --resolve-alias jquery-plugin=jquery.plugin
--resolve-extensions   | 指定需要被处理的文件的扩展名 | --resolve-extensions .es6 .js .ts
--resolve-loader-alias | Minimize javascript and switches loaders to minimizing  |


### 统计数据配置

以下选项用于配置 Webpack 在控制台输出的[统计数据](/configuration/stats/)，以及这些数据的样式。

参数 | 说明 | Type
-------------------------------- | ------------------------------------------------------------------ | -------
`--color`, `--colors` | E开启/关闭控制台的颜色 [默认值：(supports-color)] | boolean
`--display`                      | 选择[显示预设](/configuration/stats)(verbose - 繁琐, detailed - 细节, normal - 正常, minimal - 最小, errors-only - 仅错误, none - 无; 从 webpack 3.0.0 开始) | string
`--display-cached` | 在输出中显示缓存的模块 | boolean
`--display-cached-assets` | 在输出中显示缓存的 assets | boolean
`--display-chunks` | 在输出中显示 chunks | boolean
`--display-depth` | 显示从入口起点到每个模块的距离 | boolean
`--display-entrypoints`   | 在输出中显示入口文件 | boolean
`--display-error-details` | 显示详细的错误信息 | boolean
`--display-exclude`       | 在输出中显示被排除的文件 | boolean
`--display-max-modules`          | 设置输出中可见模块的最大数量 | number
`--display-modules` | 在输出中显示所有模块，包括被排除的模块 | boolean
`--display-optimization-bailout` | 作用域提升回退触发器(Scope hoisting fallback trigger)（从 webpack 3.0.0 开始） | boolean
`--display-origins` | 在输出中显示最初的 chunk | boolean
`--display-provided-exports`     | 显示有关从模块导出的信息 | boolean
`--display-reasons` | 显示模块包含在输出中的原因 | boolean
`--display-used-exports` | 显示模块中被使用的接口（Tree Shaking） | boolean
`--hide-modules` | 隐藏关于模块的信息 | boolean
`--sort-assets-by` | 对 assets 列表以某种属性排序 | string
`--sort-chunks-by`               | 对 chunks 列表以某种属性排序 | string
`--sort-modules-by`              | 对模块列表以某种属性排序 | string
`--verbose`                      | 显示更多信息 | boolean


### 高级配置

参数 | 说明 | 用法
----------------- | ---------------------------------------- | -----
`--bail` | 一旦发生错误，立即终止 |
`--cache` | 开启缓存 [watch 时会默认打开] | `--cache=false`
`--define` | 定义 bundle 中的任意自由变量，查看 [shimming](/guides/shimming) | `--define process.env.NODE_ENV='development'`
`--hot`           | 开启[模块热替换](/concepts/hot-module-replacement) | `--hot=true`
`--labeled-modules` | 开启模块标签 [使用 LabeledModulesPlugin] |
`--plugin`        | 加载某个[插件](/configuration/plugins/) |
`--prefetch`      | 预加载某个文件 | `--prefetch=./files.js`
`--provide`       | 在所有模块中将这些模块提供为自由变量，查看 [shimming](/guides/shimming) | `--provide jQuery=jquery`
`--records-input-path` | 记录文件的路径（读取） |
`--records-output-path` | 记录文件的路径（写入） |
`--records-path`  | 记录文件的路径 |
`--target`        | [目标](/configuration/target/)的执行环境 | `--target='node'`

### 简写

简写 | 含义
---------|----------------------------
-d       | `--debug --devtool cheap-module-eval-source-map --output-pathinfo`
-p       | `--optimize-minimize --define process.env.NODE_ENV="production"`, see [building for production](/guides/production)


### Profiling

`--profile` 选项捕获编译时每个步骤的时间信息，并且将这些信息包含在输出中。

```bash
webpack --profile

⋮
[0] ./src/index.js 90 bytes {0} [built]
    factory:22ms building:16ms = 38ms
```

For each module, the following details are included in the output as applicable:

* `factory`: time to collect module metadata (e.g. resolving the filename)
* `building`: time to build the module (e.g. loaders and parsing)
* `dependencies`: time to identify and connect the module’s dependencies

Paired with `--progress`, `--profile` gives you an in depth idea of which step in the compilation is taking how long. This can help you optimise your build in a more informed manner.

```bash
webpack --progress --profile

30ms building modules
1ms sealing
1ms optimizing
0ms basic module optimization
1ms module optimization
1ms advanced module optimization
0ms basic chunk optimization
0ms chunk optimization
1ms advanced chunk optimization
0ms module and chunk tree optimization
1ms module reviving
0ms module order optimization
1ms module id optimization
1ms chunk reviving
0ms chunk order optimization
1ms chunk id optimization
10ms hashing
0ms module assets processing
13ms chunk assets processing
1ms additional chunk assets processing
0ms recording
0ms additional asset processing
26ms chunk asset optimization
1ms asset optimization
6ms emitting
⋮
```

***

> 原文：https://webpack.js.org/api/cli/



#### webpack NPM插件
- npm install babel-minify-webpack-plugin --save-dev   [压缩代码](https://github.com/webpack-contrib/babel-minify-webpack-plugin)     
- npm install clean-webpack-plugin --save-dev   清除文件夹    
- npm install --save-dev html-webpack-plugin    创建HTML文件   
- npm install --save-dev express webpack-dev-middleware  创建热插件       
- npm install --save-dev extract-text-webpack-plugin 提取外部css   
#### webpack 内部插件 {#innerPlugin}
插件 | 描术
-|-
webpack.optimize.CommonsChunkPlugin  | 创建 公共js 
BabelMinifyWebpackPlugin | 使用 babel-minify进行压缩
BannerPlugin | 在每个生成的 chunk 顶部添加 banner
CommonsChunkPlugin | 提取 chunks 之间共享的通用模块
ComponentWebpackPlugin | 通过 webpack 使用组件
CompressionWebpackPlugin | 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
ContextReplacementPlugin | 重写 require 表达式的推断上下文
DefinePlugin | 允许在编译时(compile time)配置的全局常量
DllPlugin | 为了极大减少构建时间，进行分离打包
EnvironmentPlugin | DefinePlugin  中 process.env 键的简写方式。
ExtractTextWebpackPlugin | 从 bundle 中提取文本（CSS）到单独的文件
HotModuleReplacementPlugin | 启用模块热替换(Enable Hot Module Replacement - HMR)
HtmlWebpackPlugin | 简单创建 HTML 文件，用于服务器访问
I18nWebpackPlugin | 为 bundle 增加国际化支持
IgnorePlugin | 从 bundle 中排除某些模块
LimitChunkCountPlugin | 设置 chunk 的最小/最大限制，以微调和控制 chunk
LoaderOptionsPlugin | 用于从 webpack 1 迁移到 webpack 2
MinChunkSizePlugin | 确保 chunk 大小超过指定限制
NoEmitOnErrorsPlugin | 在输出阶段时，遇到编译错误跳过
NormalModuleReplacementPlugin | 替换与正则表达式匹配的资源
NpmInstallWebpackPlugin | 在开发时自动安装缺少的依赖
ProvidePlugin | 不必通过 import/require 使用模块
SourceMapDevToolPlugin | 对 source map 进行更细粒度的控制
UglifyjsWebpackPlugin | 可以控制项目中 UglifyJS 的版本
ZopfliWebpackPlugin | 通过 node-zopfli 将资源预先压缩的版本
```
        {
name: string, // or
names: string[],
// 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
// 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
// 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
// 否则 `options.filename` 会用于作为 chunk 名。
// When using `options.async` to create common chunks from other async chunks you must specify an entry-point
// chunk name here instead of omitting the `option.name`.

filename: string,
// common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
// 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
// This option is not permitted if you're using `options.async` as well, see below for more details.

minChunks: number|Infinity|function(module, count) -> boolean,
// 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
// 数量必须大于等于2，或者少于等于 chunks的数量
// 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
// 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

chunks: string[],
// 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
// 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。


children: boolean,
// 如果设置为 `true`，所有  公共chunk 的子模块都会被选择

deepChildren: boolean,
// If `true` all descendants of the commons chunk are selected

async: boolean|string,
// 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
// 它会与 `options.chunks` 并行被加载。
// Instead of using `option.filename`, it is possible to change the name of the output file by providing
// the desired string here instead of `true`.

minSize: number,
// 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。

自动加载模块，而不必到处 import 或 require 。        
webpack.ProvidePlugin    
[压缩js](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin)     
webpack.optimize.UglifyJsPlugin        
npm i  --save-dev uglifyjs-webpack-plugin            
npm install babel-minify-webpack-plugin --save-dev   
```


### loader 加载器 {#loader}  
#### 文件
- raw-loader 加载文件原始内容（utf-8）
- val-loader 将代码作为模块执行，并将 exports 转为 JS 代码
- url-loader 像 file loader 一样工作，但如果文件小于限制，可以返回 data URL
- file-loader 将文件发送到输出文件夹，并返回（相对）URL 

#### JSON
- json-loader 加载 JSON 文件（默认包含）
- json5-loader 加载和转译 JSON 5 文件
- cson-loader 加载和转译 CSON 文件

#### 转换编译(Transpiling)
- script-loader 在全局上下文中执行一次 JavaScript 文件（如在 script 标签），不需要解析
- babel-loader 加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
- buble-loader 使用 Bublé 加载 ES2015+ 代码，并且将代码转译为 ES5
- traceur-loader 加载 ES2015+ 代码，然后使用 Traceur 转译为 ES5
- ts-loader 或 awesome-typescript-loader 像 JavaScript 一样加载 TypeScript 2.0+
- coffee-loader 像 JavaScript 一样加载 CoffeeScript

#### 模板(Templating)
- html-loader 导出 HTML 为字符串，需要引用静态资源
- pug-loader 加载 Pug 模板并返回一个函数
- jade-loader 加载 Jade 模板并返回一个函数
- markdown-loader 将 Markdown 转译为 HTML
- react-markdown-loader 使用 markdown-parse parser(解析器) 将 Markdown 编译为 - React 组件
- posthtml-loader 使用 PostHTML 加载并转换 HTML 文件
- handlebars-loader 将 Handlebars 转移为 HTML
- markup-inline-loader 将内联的 SVG/MathML 文件转换为 HTML。在应用于图标字体，或将 - CSS 动画应用于 SVG 时非常有用。

#### 样式
- style-loader 将模块的导出作为样式添加到 DOM 中
- css-loader 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- less-loader 加载和转译 LESS 文件
- sass-loader 加载和转译 SASS/SCSS 文件
- postcss-loader 使用 PostCSS 加载和转译 CSS/SSS 文件
- stylus-loader 加载和转译 Stylus 文件

#### 清理和测试(Linting && Testing)
- mocha-loader 使用 mocha 测试（浏览器/NodeJS）
- eslint-loader PreLoader，使用 ESLint 清理代码
- jshint-loader PreLoader，使用 JSHint 清理代码
- jscs-loader PreLoader，使用 JSCS 检查代码样式
- coverjs-loader PreLoader，使用 CoverJS 确定测试覆盖率

#### 框架(Frameworks)
- vue-loader 加载和转译 Vue 组件
- polymer-loader 使用选择预处理器(preprocessor)处理，并且 require() 类似一等模块(first-class)的 Web 组件
- angular2-template-loader 加载和转译 Angular 组件

### [webpack 开发编译工具](https://doc.webpack-china.org/guides/development/#-source-map) {#compile}
每次要编译代码时，手动运行 `npm run build` 就会变得很麻烦。

webpack 中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码
:    webpack's Watch Mode 观察模式
webpack-dev-server 静态服务
webpack-dev-middleware 中间件

多数场景中，你可能需要使用 webpack-dev-server，但是不妨探讨一下以上的所有选项。
使用观察模式

#### 使用观察模式
你可以指示 webpack "watch" 依赖图中的所有文件以进行更改。如果其中一个文件被更新，代码将被重新编译，所以你不必手动运行整个构建。

我们添加一个用于启动 webpack 的观察模式的 npm script 脚本：
###### package.json
```javascript
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "watch": "webpack --watch",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^0.1.16",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^3.0.0",
      "xml-loader": "^1.2.1"
    }
  }
```
现在，你可以在命令行中运行 npm run watch，就会看到 webpack 编译代码，然而却不会退出命令行。这是因为 script 脚本还在观察文件。

现在，webpack 观察文件的同时，我们先移除我们之前引入的错误：
```
src/print.js

  export default function printMe() {
-   console.error('I get called from print.js!');
+   console.log('I get called from print.js!');
  }
```
现在,保存文件并检查终端窗口。应该可以看到 webpack 自动重新编译修改后的模块！

唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。如果能够自动刷新浏览器就更好了，可以尝试使用 webpack-dev-server，恰好可以实现我们想要的功能。

使用 webpack-dev-server
webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。让我们设置以下：

npm install --save-dev webpack-dev-server
修改配置文件，告诉开发服务器(dev server)，在哪里查找文件：

webpack.config.js
```javascript
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```
以上配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。

让我们添加一个 script 脚本，可以直接运行开发服务器(dev server)：

>package.json
```javascript
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --progress --watch",
+     "start": "webpack-dev-server --open",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^0.1.16",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^3.0.0",
      "xml-loader": "^1.2.1"
    }
  }
  ```
现在，我们可以在命令行中运行 npm start，就会看到浏览器自动加载页面。如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码。试一下！

webpack-dev-server 带有许多可配置的选项。转到相关文档以了解更多。

现在，服务器正在运行，你可能需要尝试模块热替换(Hot Module Replacement)！
使用 webpack-dev-middleware
webpack-dev-middleware 是一个中间件容器(wrapper)，它将通过 webpack 处理后的文件发布到一个服务器(server)。在内部 webpack-dev-server 它使用，然而，它可以作为一个单独的包来提供，可以进行更多的自定义设置来实现更多需求。接下来是一个 webpack-dev-middleware 配合 express server 的示例。

首先，安装 express 和 webpack-dev-middleware：

npm install --save-dev express webpack-dev-middleware
接下来我们需要对 webpack 的配置文件做一些调整，以确保中间件(middleware)功能能够正确启用：

###### webpack.config.js
```javascript
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    devtool: 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/'
    }
  };
```
publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问，我们稍后再设置端口号。下一步就是设置我们自定义的 express 服务：

###### project
```javascript
  webpack-demo
  |- package.json
  |- webpack.config.js
+ |- server.js
  |- /dist
  |- /src
    |- index.js
    |- print.js
  |- /node_modules
server.js

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
现在，添加一个 npm script，以使我们更方便地运行服务：

###### package.json
```javascript
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --progress --watch",
      "start": "webpack-dev-server --open",
+     "server": "node server.js",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^0.1.16",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "express": "^4.15.3",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^3.0.0",
      "webpack-dev-middleware": "^1.12.0",
      "xml-loader": "^1.2.1"
    }
  }
``` 
现在，在你的终端执行 npm run server，将会有类似如下信息输出：

现在，打开浏览器，跳转到 http://localhost:3000，你应该看到你的webpack 应用程序已经运行！

#### 模块热替换
模块热替换
编辑此页
本指南示例代码延用开发指南的示例代码。
模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。本页面重点介绍实现，而概念页面提供了更多关于它的工作原理以及为什么它有用的细节。

HMR 不适用于生产环境，这意味着它应当只在开发环境使用。更多详细信息，请查看生产环境构建指南。
启用 HMR
启用此功能实际上相当简单。而我们要做的，就是更新 webpack-dev-server 的配置，和使用 webpack 内置的 HMR 插件。我们还要删除掉 print.js 的入口起点，因为它现在正被 index.js 模式使用。

如果你使用了 webpack-dev-middleware 而没有使用 webpack-dev-server，请使用 webpack-hot-middleware package 包，以在你的自定义服务或应用程序上启用 HMR。
###### webpack.config.js
```javascript
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const webpack = require('webpack');

  module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
+     new webpack.NamedModulesPlugin(),
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```
你可以通过命令来修改 webpack-dev-server 的配置：webpack-dev-server --hotOnly。
注意，我们还添加了 NamedModulesPlugin，以便更容易查看要修补(patch)的依赖。在起步阶段，我们将通过在命令行中运行 npm start 来启动并运行 dev server。

现在，我们来修改 index.js 文件，以便当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块。

###### index.js
```javascript
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
+
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
更改 print.js 中 console.log 的输出内容，你将会在浏览器中看到如下的输出。

print.js

  export default function printMe() {
-   console.log('I get called from print.js!');
+   console.log('Updating print.js...')
  }
```
通过 Node.js API
当使用 webpack dev server 和 Node.js API 时，不要将 dev server 选项放在 webpack 配置对象(webpack config object)中。而是，在创建选项时，将其作为第二个参数传递。例如：

>new WebpackDevServer(compiler, options)

想要启用 HMR，还需要修改 webpack 配置对象，使其包含 HMR 入口起点。webpack-dev-server package 中具有一个叫做 addDevServerEntrypoints 的方法，你可以通过使用这个方法来实现。这是关于如何使用的一个小例子：

>dev-server.js
```javascript
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```
如果你使用WebPACK开发中间件，看看WebPACK热中间件封装使HMR你自定义的开发服务器。
问题
模块热替换可能比较难掌握。为了说明这一点，我们回到刚才的示例中。如果你继续点击示例页面上的按钮，你会发现控制台仍在打印这旧的 printMe 功能。

这是因为按钮的 onclick 事件仍然绑定在旧的 printMe 函数上。

为了让它与 HRM 正常工作，我们需要使用 module.hot.accept 更新绑定到新的 printMe 函数上：

>index.js
```javascript

  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick 事件绑定原始的 printMe 函数上

    element.appendChild(btn);

    return element;
  }

- document.body.appendChild(component());
+ let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
+ document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
-     printMe();
+     document.body.removeChild(element);
+     element = component(); // 重新渲染页面后，component 更新 click 事件处理
+     document.body.appendChild(element);
    })
  }
```
这只是一个例子，但还有很多其他地方可以轻松地让人犯错。幸运的是，存在很多 loader（其中一些在下面提到），使得模块热替换的过程变得更容易。

HMR 修改样式表
借助于 style-loader 的帮助，CSS 的模块热替换实际上是相当简单的。当更新 CSS 依赖模块时，此 loader 在后台使用 module.hot.accept 来修补(patch) <style> 标签。

所以，可以使用以下命令安装两个 loader ：

npm install --save-dev style-loader css-loader
接下来我们来更新 webpack 的配置，让这两个 loader 生效。

>webpack.config.js
```javascript
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const webpack = require('webpack');

  module.exports = {
    entry: {
      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: ['style-loader', 'css-loader']
+       }
+     ]
+   },
    plugins: [
      new CleanWebpackPlugin(['dist'])
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
  ```
热加载样式表，与将其导入模块一样简单：

>project
```javascript

  webpack-demo
  | - package.json
  | - webpack.config.js
  | - /dist
    | - bundle.js
  | - /src
    | - index.js
    | - print.js
+   | - styles.css
styles.css

body {
  background: blue;
}
index.js

  import _ from 'lodash';
  import printMe from './print.js';
+ import './styles.css';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
  }

  let element = component();
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element);
      element = component(); // Re-render the "component" to update the click handler
      document.body.appendChild(element);
    })
  }
```
将 body 上的样式修改为 background: red;，您应该可以立即看到页面的背景颜色随之更改，而无需完全刷新。

>styles.css
```css
  body {
-   background: blue;
+   background: red;
  }
 ```
其他代码和框架

社区还有许多其他 loader 和示例，可以使 HMR 与各种框架和库(library)平滑地进行交互……
:    React Hot Loader：实时调整 react 组件。
Vue Loader：此 loader 支持用于 vue 组件的 HMR，提供开箱即用体验。
Elm Hot Loader：支持用于 Elm 程序语言的 HMR。
Redux HMR：无需 loader 或插件！只需对 main store 文件进行简单的修改。
Angular HMR：No loader necessary! A simple change to your main NgModule file is all that's required to have full control over the HMR APIs.没有必要使用 loader！只需对主要的 NgModule 文件进行简单的修改，由 HMR API 完全控制。

### 模块热替换(Hot Module Replacement)
如果已经通过 HotModuleReplacementPlugin 启用了模块热替换(Hot Module Replacement)，则它的接口将被暴露在 module.hot 属性下面。通常，用户先要检查这个接口是否可访问，然后再开始使用它。举个例子，你可以这样 accept 一个更新的模块：
```
if (module.hot) {
  module.hot.accept('./library.js', function() {
    // 使用更新过的 library 模块执行某些操作...
  })
}
```
支持以下方法……
**accept**
接受(accept)给定依赖模块的更新，并触发一个 回调函数 来对这些更新做出响应。
```
module.hot.accept(
  dependencies, // 可以是一个字符串或字符串数组
  callback // 用于在模块更新后触发的函数
)
```
**decline**
拒绝给定依赖模块的更新，使用 'decline' 方法强制更新失败。
```
module.hot.decline(
  dependencies // 可以是一个字符串或字符串数组
)
```
**dispose（或 addDisposeHandler）**
添加一个处理函数，在当前模块代码被替换时执行。此函数应该用于移除你声明或创建的任何持久资源。如果要将状态传入到更新过的模块，请添加给定 data 参数。更新后，此对象在更新之后可通过 module.hot.data 调用。
```

module.hot.dispose(data => {
  // 清理并将 data 传递到更新后的模块……
})
```
**removeDisposeHandler**
删除由 dispose 或 addDisposeHandler 添加的回调函数。
```

module.hot.removeDisposeHandler(callback)
```
**status**
取得模块热替换进程的当前状态。
```

module.hot.status() // 返回以下字符串之一……
```
Status | Description
--|--
idle | 该进程正在等待调用 check（见下文）
check | 该进程正在检查以更新
prepare | 该进程正在准备更新（例如，下载已更新的模块）
ready | 此更新已准备并可用
dispose | 该进程正在调用将被替换模块的 dispose 处理函数
apply | 该进程正在调用 accept 处理函数，并重新执行自我接受(self-accepted)的模块
abort | 更新已中止，但系统仍处于之前的状态
fail | 更新已抛出异常，系统状态已被破坏

**check**
 测试所有加载的模块以进行更新，如果有更新，则应用它们。
```

module.hot.check(autoApply).then(outdatedModules => {
  // 超时的模块……
}).catch(error => {
  // 捕获错误
});
```
`autoApply`参数可以是布尔值，也可以是 options，当被调用时可以传递给 apply 方法。

**apply**
继续更新进程（只要 module.hot.status() === 'ready'）。
```
module.hot.apply(options).then(outdatedModules => {
  // 超时的模块……
}).catch(error => {
  // 捕获错误
});
```
可选的 options 对象可以包含以下属性：

- ignoreUnaccepted (boolean): Ignore changes made to unaccepted modules.
- ignoreDeclined (boolean): Ignore changes made to declined modules.
- ignoreErrored (boolean): Ignore errors throw in accept handlers, error - handlers and while reevaulating module.
- onDeclined (function(info)): Notifier for declined modules
- onUnaccepted (function(info)): Notifier for unaccepted modules
- onAccepted (function(info)): Notifier for accepted modules
- onDisposed (function(info)): Notifier for disposed modules
- onErrored (function(info)): Notifier for errors

The info parameter will be an object containing some of the following values:
```javascript
{
  type: "self-declined" | "declined" |
        "unaccepted" | "accepted" |
        "disposed" | "accept-errored" |
        "self-accept-errored" | "self-accept-error-handler-errored",
  moduleId: 4, // The module in question.
  dependencyId: 3, // For errors: the module id owning the accept handler.
  chain: [1, 2, 3, 4], // For declined/accepted/unaccepted: the chain from where the update was propagated.
  parentId: 5, // For declined: the module id of the declining parent
  outdatedModules: [1, 2, 3, 4], // For accepted: the modules that are outdated and will be disposed
  outdatedDependencies: { // For accepted: The location of accept handlers that will handle the update
    5: [4]
  },
  error: new Error(...), // For errors: the thrown error
  originalError: new Error(...) // For self-accept-error-handler-errored:
                                // the error thrown by the module before the error handler tried to handle it.
}
```
**addStatusHandler**
注册一个函数来监听 status的变化。
```

module.hot.addStatusHandler(status => {
  // 响应当前状态……
})
```
**removeStatusHandler**
移除一个注册的状态处理函数。
```
module.hot.removeStatusHandler(callback)
```

#### 工具
创建jsx 解析   
npm install --save-dev @babel/plugin-syntax-jsx
#### 测试插件

#### 安装es6编译插件 
npm install --save-dev babel-loader babel-core 创建.babelrc配置文件 Env预设
npm install babel-preset-env --save-dev

1. Babel-types: Babel Types 是一个为 AST 节点提供的 lodash 类的实用程序库。
2. Babel-register: 需要钩子的节点会被自动绑定到对应的钩子上，并且能自动即时编译。
1. Babel-template: 从一个字符串模板中生成 AST。
1. Babel-helpers: Babel 转换的帮助函数集合。
1. Babel-code-frame: 生成能指向出现错误原因的代码框架
1. Babylon: Babylon 是一个用于 Babel 的 JavaScript 解析器。

* preses
  * env
  * es2015
  * es2016
  * es2017
  * latest (不推荐, 请使用 env)
  * react
  * flow

>不稳定
这些提案可能会有所改动，因此请谨慎使用，尤其是第 3 阶段以前的提案。我们计划会在每次 TC39 会议结束后更新对应的 stage-x preset。

* TC39 将提案分为以下几个阶段:
  * Stage 0 - 稻草人: 只是一个想法，可能是 babel 插件。
  * Stage 1 - 提案: 初步尝试。
  * Stage 2 - 初稿: 完成初步规范。
  * Stage 3 - 候选: 完成规范和浏览器初步实现。
  * Stage 4 - 完成: 将被添加到下一年度发布。
```javascript
{
"presets": ["env",{
"targets":{
        "chrome":52
},
        "modules": 'commonjs',
        "useBuiltIns": false,
        "debug": true
        }],
        "plugins": [],
        "ignore": []
}
/*Plugin/Preset 排序
插件中每个访问者都有排序问题。
这意味着如果两次转译都访问相同的”程序”节点，则转译将按照 plugin 或 preset 的规则进行排序然后执行。
Plugin 会运行在 Preset 之前。
Plugin 会从第一个开始顺序执行。ordering is first to last.
Preset 的顺序则刚好相反(从最后一个逆序执行)。
例如:*/
Copy
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
/*将先执行 transform-decorators-legacy 再执行 transform-class-properties.
一定要记得 preset 的顺序是反向的。举个例子:*/
Copy
{
  "presets": [
    "es2015",
    "react",
    "stage-2"
  ]
}
/*按以下顺序运行: stage-2， react， 最后 es2015 。
这主要是为了保证向后兼容，因为大多数用户会在 “stage-0” 之前列出 “es2015” 。欲了解相关更多信息，请查看 关于隐式遍历 API 变化的说明 。*/
```
没有任何配置选项，babel-preset-env与babel-preset-latest（或者babel-preset-es2015，babel-preset-es2016和babel-preset-es2017一起）的行为完全相同。

#### babel-core

```
可选参数	默认值	描述
ast	true	返回值对象中包含 AST
auxiliaryCommentAfter	null	在所有非用户编写代码后附加注释。
auxiliaryCommentBefore	null	在所有非用户编写代码前附加注释。
babelrc	true	指定是否使用 .babelrc 和 babelignore 文件。 使用 CLI 工具时不能使用该选项，请使用 --no-babelrc 代替。
code	true	是否启用代码生成选项。
comments	true	生成的代码中是否添加注释。
compact	"auto"	不要包含多余的空格符和换行符。设置为 "auto" 时，当输入大小 > 500KB 时，compact会被设置为 true。
env	{}	这是表示不同环境的键的对象。例如，当环境变量 BABEL_ENV 设置为 "production" 时，可以像这样设置 { env: { production: { /* specific options */ } } }。如果 BABEL_ENV 未设置，那么 NODE_ENV 将被启用，如果 NODE_ENV 也未被设置，则默认为 "development" 环境。
extends	null	扩展 .babelrc 文件的路径
filename	"unknown"	使用错误的文件名等。
filenameRelative	(filename)	相对于 sourceRoot 的文件名。
generatorOpts	{}	包含要传递给 babel 代码生成器(babel-generator)的选项对象。
getModuleId	null	指定一个自定义回调来生成模块 ID 。调用方式为 getModuleId(moduleName)。如果返回值为 falsy ，则说明生成的模块 ID 被使用。
highlightCode	true	ANSI 错误语法高亮显示。
ignore	null	与 only 选项相对。如果只指定 only，则 ignore 则被忽略。
inputSourceMap	null	输出的 source map 将基于该 source map 对象。
minified	false	保证输出最小化(不输出代码块最后一个分号，输出文字为字符串而不是转义字符串，安全情况下 new 后的 () 会被去除)
moduleId	null	指定模块 ID 的自定义名称。
moduleIds	false	如果值为 true，为模块添加一个明确的 ID 。默认情况下，所有模块都是匿名的。(不适用于 common 模块)
moduleRoot	(sourceRoot)	AMD 模块格式化程序的可选前缀，可以被预先添加到模块定义的文件名当中。
only	null	可填入一个 glob，正则表达式或者混合数组，只编译匹配到的路径。也可以是包含明确匹配路径的数组。在尝试编译非匹配的文件时，它将原样返回。
parserOpts	{}	需要传递给 babel 解析器，babylon 的选项对象
plugins	[]	需要加载和使用的 plugin 列表。
presets	[]	需要加载和使用的 preset (一组 plugin ) 列表。
retainLines	false	保留行号。这将导致代码变得很古怪，但对于不能使用 source map 的场景来说很方便。(注意: 这不会对列进行保留)
resolveModuleSource	null	解析模块入口，例如 import "SOURCE"; 引入自定义值。具体调用为 resolveModuleSource(source, filename) 。
shouldPrintComment	null	一个可选的回调，控制是否需要输出注释。具体调用为 shouldPrintComment(commentContents) 。 注意: 该选项使用时会覆盖 comment 选项。
sourceFileName	(filenameRelative)	在返回的 source map 上设置 sources[0]。
sourceMaps	false	如果为 true ，添加一个 map 属性在输出的返回值中。如果设置为 "inline" ，带有sourceMappingURL指令的注释被添加到返回代码的底部。如果设置为 "both" ，则会返回 map 属性并追加 source map 注释。它不会自己生成 sourcemap 文件！ 要想让 CLI 生成 sourcemap ，你必须给它传递 --source-maps 选项。
sourceMapTarget	(filenameRelative)	在返回 souremap 时设置 file。
sourceRoot	(moduleRoot)	所有 source 都是相对于 root 的。
sourceType	"module"	设置 babel 解析代码的模式。可以设置为 “script” 或 “module” 。
wrapPluginVisitorMethod	null	可用于包装访问者模式的可选回调。注意: 这对于自我检查这样的事是有必要的，并且不需要实现任何方法。具体调用为 wrapPluginVisitorMethod(pluginAlias, visitorType, callback) 。
```

##### 安装babel-es2015 {#babel}
[es2015](https://babeljs.cn/docs/plugins/preset-es2015/)     
npm install --save-dev babel-preset-es2015     

##### 填充  
es6语法填充它会仿效一个完整的 ES2015+ 环境，并意图运行于一个应用中而不是一个库/工具。这个 polyfill 会在使用 babel-node 时自动加载。
这意味着你可以使用新的内置对象比如 Promise 或者 WeakMap, 静态方法比如 Array.from 或者 Object.assign, 实例方法比如 Array.prototype.includes 和生成器函数（提供给你使用 regenerator 插件）。为了达到这一点， polyfill 添加到了全局范围，就像原生类型比如 String 一样。 
polyfill 相当在你的JS中，使用兼容性写法，去用es2015的语法去填充浏览器不支持的es2016的语法    
npm install --save babel-polyfill  
```javascript
import "babel-polyfill";
  //在 webpack.config.js 中，将 babel-polyfill 加到你的 entry 数组中：
  import "babel-polyfill";
 // 或者
  module.exports = {
    entry: ["babel-polyfill", "./app/js"]
  };
```
##### flow 类型转换  
npm install --save-dev babel-preset-flow  
npm install --save-dev flow-bin
##### jsx 解析和转换  
npm install --save-dev babel-plugin-syntax-jsx 解析      
npm install --save-dev babel-plugin-transform-react-jsx 转换   

##### object rest 语法解构
npm install --save-dev babel-plugin-transform-object-rest-spread 转换   
npm install --save-dev babel-plugin-syntax-object-rest-spread 解析  

##### ES2015 转换插件
npm install --save-dev babel-plugin-transform-es2015-typeof-symbol   

##### 运行时转换js语法    
在大多数情况下，您应该将其babel-plugin-transform-runtime作为开发依赖项（with --save-dev）进行安装。  
 npm install --save-dev babel-plugin-transform-runtime   

```javascript
/**
 Babel使用非常小的助手来执行常见的功能_extend。默认情况下，这将被添加到每个需要它的文件。这种重复有时是不必要的，特别是当你的应用程序分散在多个文件上时。
这是transform-runtime插件来的地方：所有的助手都会引用模块，babel-runtime以避免编译后的输出重复。运行时将被编译到您的版本中。
这个转换器的另一个目的是为你的代码创建一个沙盒环境。如果您使用的bael-polyfill，它提供了诸如内置插件Promise，Set和Map那些会污染全局范围。虽然这对于应用程序或命令行工具来说可能是好的，但是如果你的代码是一个你打算发布给其他人使用的库，或者如果你不能完全控制你的代码运行的环境，那么这就成了一个问题。
变压器将使用这些内置插件，core-js以便无缝地使用它们，而无需使用polyfill。
有关如何工作的更多信息以及发生的转换类型，请参阅技术详细信息部分。

该runtime变压器插件做了三两件事：
babel-runtime/regenerator当您使用生成器/异步函数时自动需要。
自动需要babel-runtime/core-js并映射ES6静态方法和内置插件。
删除内联Babel助手并使用该模块babel-runtime/helpers。
这究竟意味着什么呢？基本上，你可以使用内置的插件，如Promise，Set，Symbol，等，以及使用所有需要填充工具无缝连接，无需全球污染通天特点，使其非常适合于图书馆。
确保你包含babel-runtime一个依赖项。
*/
{
  "plugins": [
    ["transform-runtime", {
      /*boolean，默认为true。切换是否内联通天佣工（classCallCheck，extends，等）被替换为调用moduleName。*/
      "helpers": false, 
      /*boolean，默认为true。切换是否没有新的内置插件（Promise，Set，Map等）转化为使用非全球污染填充工具。有关更多信息，请参见core-js别名。*/
      "polyfill": false,
      /*boolean，默认为true。切换是否将生成器函数转换为使用不会污染全局作用域的再生器运行时。有关更多信息，请参阅再生器别名。*/
      "regenerator": true,
      //string，默认为"babel-runtime"。设置导入助手时使用的模块的名称/路径。
      "moduleName": "babel-runtime"
    }]
  ]
}
```
#### 安装开发依赖
npm install vue element-ui lodash vue jquery -S

#### 类属性声明定义转换
npm install --save-dev babel-plugin-transform-class-properties  转换          
npm install --save-dev babel-plugin-syntax-class-properties   解析    
 ```javascript     
class Bork {
//Property initializer syntax
instanceProperty = "bork";
boundFunction = () => {
return this.instanceProperty;
}

//Static class properties
static staticProperty = "babelIsCool";
static staticFunction = function() {
return Bork.staticProperty;
}
}
```
## VSCODE
常用插件
- gulp shnipperts
- html css support
- debugger for chrome 
- document this
- javascript es code snippets
- markdown all in one 所有你需要Markdown（键盘快捷键，目录，自动预览和更多）。
- markdown preview enhanced 
- npm 
- sass
- vscode-flow-ide
- vue2 snippets
### vs code 调试  "Control+Space"   
```
以下属性对于每个启动配置都是必需的：

type - 用于此启动配置的调试器类型。每安装调试扩展引入一个类型，例如，node对于内置的节点调试器，或php与go对PHP和去扩展。
request - 此启动配置的请求类型。目前支持的是launch和attach。
name - 出现在Debug启动配置下拉列表中的友好名称。
以下是可用于所有启动配置的一些可选属性：

preLaunchTask- 要在调试会话开始之前启动任务，请将此属性设置为tasks.json（位于工作区.vscode文件夹下）中指定的任务的名称。
internalConsoleOptions - 在调试会话期间控制调试控制台面板的可见性
debugServer- 仅限调试扩展作者：连接到指定的端口，而不是启动调试适配器
许多调试器支持以下一些属性：

program - 启动调试器时运行的可执行文件或文件
args - 传递给程序进行调试的参数
env - 环境变量
cwd - 用于查找依赖关系和其他文件的当前工作目录
port - 连接到正在运行的进程时的端口
stopOnEntry - 节目启动时立即中断
console-要使用什么样的主机，例如internalConsole，integratedTerminal，externalTerminal。

VS Code支持字符串中的变量替换，launch.json并具有以下预定义变量：

预定义的变量
支持以下预定义变量：

$ {workspaceFolder} - 在VS Code中打开的文件夹的路径
$ {workspaceFolderBasename} - VS代码中打开的文件夹的名称，没有任何斜杠（/）
$ {file} - 当前打开的文件
$ {relativeFile} - 当前打开的文件相对于workspaceFolder
$ {fileBasename} - 当前打开文件的基本名称
$ {fileBasenameNoExtension} - 当前打开文件的基本名称，没有文件扩展名
$ {fileDirname} - 当前打开文件的目录名
$ {fileExtname} - 当前打开文件的扩展名
$ {cwd} - 启动时任务运行器的当前工作目录
$ {lineNumber} - 活动文件中当前选定的行号
$ {selectedText} - 活动文件中当前选定的文本
$ {execPath} - 运行VS Code可执行文件的路径
预定义变量示例
假设您有以下要求：

位于/home/your-username/your-project/folder/file.ext编辑器中打开的文件;
该目录/home/your-username/your-project作为根工作空间打开。
因此，每个变量都有以下值：

$ {workspaceFolder} -/home/your-username/your-project
$ {workspaceFolderBasename} -your-project
$ {file} -/home/your-username/your-project/folder/file.ext
$ {relativeFile} -folder/file.ext
$ {fileBasename} -file.ext
$ {fileBasenameNoExtension} -file
$ {fileDirname} -/home/your-username/your-project/folder
$ {fileExtname} -.ext
$ {lineNumber} - 游标的行号
$ {selectedText} - 在代码编辑器中选择的文本
$ {execPath} - Code.exe的位置
提示：在字符串值内使用IntelliSense tasks.json，launch.json以获取预定义变量的完整列表

$ {workspaceFolder} - 在VS Code中打开的文件夹的路径
$ {workspaceFolderBasename} - VS代码中打开的文件夹的名称，不带任何斜杠（/）
$ {file} - 当前打开的文件
$ {relativeFile} - 当前打开的文件相对于workspaceFolder
$ {fileBasename} - 当前打开的文件的基本名称
$ {fileBasenameNoExtension} - 当前打开的文件的基本名称，没有文件扩展名
$ {fileDirname} - 当前打开的文件的dirname
$ {fileExtname} - 当前打开的文件的扩展名
$ {cwd} - 启动时任务运行者的当前工作目录
$ {lineNumber} - 活动文件中当前选定的行号
您也可以通过$ {env：Name}语法（例如，$ {env：PATH}）来引用环境变量。确保匹配环境变量名称的外壳，例如${env:Path}在Windows上。  
{
"type": "node",
"request": "launch",
"name": "Launch Program",
"program": "${workspaceFolder}/app.js",
"cwd": "${workspaceFolder}",
"args": [ "${env:USERNAME}" ]
}
                启动配置属性
类型launch和启动配置支持以下属性attach：

protocol - 调试协议使用。请参阅上面的“支持的类似节点的运行时”一节。
port - 调试端口使用。请参阅“附加到Node.js”和“远程调试Node.js”部分。
address - 调试端口的TCP / IP地址。请参阅“附加到Node.js”和“远程调试Node.js”部分。
restart - 终止时重启会话。请参见“自动重新启动调试会话”一节。
timeout - 重新启动一个会话后，放弃这个毫秒数。请参阅“附加到Node.js”一节。
stopOnEntry - 当程序启动时立即中断。
localRoot - VS Code的根目录。请参阅下面的“远程调试Node.js”部分。
remoteRoot - 节点的根目录。请参阅下面的“远程调试Node.js”部分。
sourceMaps- 通过设置它来启用源地图true。请参阅“源地图”部分。
outFiles - 在JavaScript文件中查找的glob模式数组。请参阅“源地图”部分。
smartStep - 尝试自动跨越不映射到源文件的代码。请参见“智能步进”一节。
skipFiles - 自动跳过这些glob模式覆盖的文件。请参阅“跳过无趣代码”一节。
trace - 启用诊断输出。设置"all"为详细输出。
这些属性仅适用于请求类型的启动配置launch：

program - 调试Node.js程序的绝对路径。
args - 传递给程序进行调试的参数。这个属性的类型是数组，需要单独的参数作为数组元素。
cwd - 启动程序在这个目录下进行调试。
runtimeExecutable - 要使用的运行时可执行文件的绝对路径。默认是node。请参阅'启动npm'和其他工具的配置支持'一节。
runtimeArgs - 传递给运行时可执行文件的可选参数。
env - 可选的环境变量。该属性需要环境变量作为字符串类型键/值对的列表。
envFile - 包含环境变量定义的文件的可选路径。
console-种控制台的启动程序，例如internalConsole，integratedTerminal，externalTerminal。请参阅下面的“节点控制台”一节。
该属性仅适用于请求类型的启动配置attach：

processId - 调试器在发送USR1信号后尝试附加到这个过程。通过这个设置，调试器可以附加到一个已经运行的进程，这个进程在调试模式下没有启动。当使用该processId属性时，调试端口将根据node.js版本（和使用的协议）自动确定，并且不能被明确配置。所以不要指定一个port属性。
```

### Typescript语法编译
npm install --save-dev typescript ts-loader
tsc --init **生成typescript.json**

### gulp 打包
npm install --save-dev gulp
