# antd-mobile project create by create-react-app
基于[create-react-app](https://github.com/facebookincubator/create-react-app)创建的[antd-mobile](https://mobile.ant.design)空白项目
### 支持按需加载组件
```javascript
import { Button } from 'antd-mobile';
```
### 支持定制主题
修改`src/theme.less`文件，修改相应的变量值
### 覆盖create-react-app webpack配置
使用[react-app-rewired](https://github.com/timarney/react-app-rewired)来自定义webpack配置
### 使用环境变量
- 建立环境变量配置文件`.env.development.local`以及`.env.production.local`，分别对应开发环境（运行`yarn start`时）和生产环境（运行`yarn build`时）,复制文件`.env.example`的内容到这两个文件
- 环境变量名称必须以`REACT_APP_`为前缀
- HTML使用环境变量，用`%`包裹变量名即可，如`%REACT_APP_NAME`
- js中使用环境变量，调用`process.env`即可，如`process.env.REACT_APP_NAME`