# eos web端钱包
## 配置环境变量
建立环境变量配置文件`.env.development.local`以及`.env.production.local`，分别对应开发环境（运行`yarn start`时）和生产环境（运行`yarn build`时）,复制文件`.env.example`的内容到这两个文件
- REACT_APP_ACCOUNT_NAME 初始账户名
- REACT_APP_PRIVATE_KEY 初始账户私钥
- REACT_APP_NETWORK_HOST 节点host
- REACT_APP_NETWORK_PORT 节点HTTP端口
