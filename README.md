# sheep-solver
参数其他项目，用nodejs实现的羊了个羊解题步骤

https://github.com/BugMaker888/sheep

https://github.com/NB-Dragon/SheepSolver

无聊写着玩的，更新随缘

## 用法
安装依赖

    npm install

添加token

    在data目录下新建token.txt文件，把自己的token弄进去，不要换行

查看个人信息

    node util/get me

查看个人皮肤

    node util/get skin

获取matchInfo(相当于新开一局)

    node util/get match

获取map数据(每天只用执行一次)

    node util/get map

开始计算(地图简单加上运气好的话，一分钟内就有结果)

    node step1

提交解题步骤
    
    node util/send

如果step1没有解出来，可以尝试step2, 它是在之前的基础上模拟使用推出三张牌的道具
    
    node step2-out

如果通过step2解出来了，用下面的命令提交
    
    node util/send game2.json

如果几分钟内跑不出结果，建议重新开一局再试，祝你好运