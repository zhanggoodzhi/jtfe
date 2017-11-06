### Dependences
1. [axios](https://github.com/mzabriskie/axios)
2. [sockjs-client](https://github.com/sockjs/sockjs-client)
3. [babel-runtime](https://babeljs.io/docs/plugins/transform-runtime/)
4. [fine-uploader](https://fineuploader.com/)
5. [lodash](https://lodash.com/)

### 目录结构
dist/       浏览器外部引用版本


es/         es6语法版本


lib/        es5语法版本


example/    演示示例


### Install 
外部引用
```html
<script src="your-modules/qa-plugin/dist/qa-plugin.min.js"></script>
```

webpack
```javascript
import QAPlugin from 'your-modules/qa-plugin/es/index.js';
```

### Usage
Javascript
```javascript
var plugin = new QAPlugin(options); // 初始化实例

plugin.connect() // 连接至服务器
    .then(function(){
        plugin.requestRobot(); // 请求机器人
        // ...
    });
```

详细API见typescript定义文件


### 集成方式
1. 在html中引用js文件
    ```html
    <script src="https://demo.jintongsoft.cn/csclient/public/build/jintong/qa-plugin/dist/qa-plugin.min.js"></script>
    ```
    这个js中封装了window.QAPlugin 类,集成了所有的后台接口操作，和消息队列的维护。

2. 在自己的js文件中构建QAPlugin实例
    ```javascript
    var plugin=new QAPlugin();
    ```
    实例初始化后什么都不会做，只有调用plugin.connect()后才会连接到金童的后台。
    建议初始化完成后直接plugin.connect()，然后选择时机(一般为用户初次点击缩小状态的聊天气泡)连接到人工客服 plugin.requestStaff();

3. 简单的例子可以参考example目录。详尽的Api见es/*.d.ts。
