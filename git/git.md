
####  使版本库保持同步
working directory
staging area 
commit history(local)
commit history(github)

推送整个分支而不是单个提交


#### 添加远程版本库  
`git remote` 查看当前远程代码库  
`git remote -v` 输出更详细信息(如URL)  
`git remote add 名称 远程代码库URL` 名称指代远程的代码库名字
若只有一个远程，标准做法是命名为origin  
`git push 远程代码库 提交的分支`  
如：`git push origin master`  
默认github 创建的分支与本地push的分支具有相同名称  



#### pull changes  
远程分支的本地副本 ： 远程名/分支名  如：origin/master  
如果push 对应的本地副本也会更新  
`git fetch  远程名`（如origin 更新远程分支的所有本地副本  
`git pull = git fetch + git merge `
`git diff origin/master master`



`git pull 远程 本地分支`  

#### fork

fork只能在github环境使用  
`git clone URL` (自动添加为远程)

settings 添加合作者  



#### git status
- ahead 
- behind 
- out-of-date
- out-of-sycn 远程和本地有不同的提交


#### 快速合并  fast-forward merge  
合并的分支是被合并分支的祖先,看是不是可达的


#### pull request
可以理解为 merge request 

