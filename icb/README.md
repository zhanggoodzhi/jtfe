## Libraries
* TypeScript
* React & React-DOM
* React-Router
* Redux
* React-Redux
* Ant-Design

## 启动项目

```
npm install || yarn install     // 开启 vscode 时运行 npm install 可能存在异常
npm run dev 
```

## 注意事项/规范

### 更新组件的两种方式

1. redux 的 dispatch
2. react 的 setState


更新页面UI使用setState如按钮的loading、ui组件的toggle状态
不与其他组件共用的内部数据且无缓存需求使用setState
其余状态如页面配置项、用户状态、全局消息提醒应存储在store中


### 异步请求

使用 [Fetch API](https://github.github.io/fetch/) 并在 helper/fetch 中封装，所有的异步请求必须使用封装过的 fetch
在使用 fetch 请求并禁用了页面部分功能的场景时，必须使用 catch 捕获异常避免请求出错时页面功能无法使用


### 路由跳转

react-router-redux 将 redux 和 react-router 集成，所有的页面内跳转只能通过 redux connect 至组件后使用 props[METHOD] 跳转


### 前端路由

react-router@4 与 react-router@3 中的传统静态路由不同，将Route完全作为一个React组件使用，通过匹配路径来呈现组件


### CSS-MODULE

组件的样式通过组件的 className 控制，通过在 .tsx 中引入样式表的对象生成对应的 className ，非特殊情况只使用类选择器，命名遵循 CamelCase

