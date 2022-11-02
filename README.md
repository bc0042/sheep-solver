# sheep-solver
参考其他项目，用nodejs实现的羊了个羊解题步骤，无聊写着玩的

https://github.com/BugMaker888/sheep

https://github.com/NB-Dragon/SheepSolver

https://github.com/AdamYoung1234/SheepASheepV2


## 用法
安装依赖

    npm install

添加token

    在data目录下新建token.txt文件，把自己的token弄进去，不要换行

查看个人信息

    node util/get me

查看个人皮肤

    node util/get skin

获取matchInfo (话题把参数改成topic, 再把data/topic复制到data/match)

    node util/get match

获取map数据 (根据match里面的md5获取)

    node util/get map

开始挑战 (话题把challenge改成topic)

    node auto-test-challenge

提交 (话题再加一个参数 topic)

    node util/send game2.json