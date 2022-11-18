# sheep-solver
羊了个羊模拟使用道具解题，无聊写着玩的

参考项目

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

获取matchInfo (话题把参数改成topic)

    node util/get match

获取map数据 (根据match里面的md5获取)

    node util/get map

开始挑战 (话题把challenge改成topic)

    node auto-test-challenge

提交 (提交话题前需要先加入 node util/get t_join 1, 加入右边把1改成2, 提交话题 node util/send game2.json topic)

    node util/send game2.json
