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

获取matchInfo(相当于新开一局)

    node util/get match

获取map数据(每天只用执行一次)

    node util/get map

开始计算第一步(跑到70%左右)

    node step1

如果第一步没有跑出结果，重新获取matchInfo
如果第一步成功跑出结果，尝试用道具(模拟连续使用两次移出)
    
    node step2-out2

如果上面跑出结果，就可以提交

    node util/send game2.json

如果没有跑出结果，还可以尝试step2(模拟使用一次移出), 然后再step3(再使用一次移出)
    
    node step2
    node step3

如果通过step3跑出来了，用下面的命令提交
    
    node util/send game3.json

如果都跑不出结果，建议重新开一局再试，祝你好运