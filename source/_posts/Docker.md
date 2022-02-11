---
title: Docker
date: 2020-02-25 11:31:48
tags:
---

# Docker是什么?
一次封装,到处执行(不用配置环境,任何环境下都能运行应用,极大简化部署)
基于linux的高效,敏捷,轻量级的容器(轻量虚拟)的方案

* 虚拟化技术
完全虚拟化: VMware Workstation, VirtualBox
硬件辅助虚拟化: InterVT, AMD-V
超虚拟化技术: Xen
操作系统级: Docker LXC容器
* 部署一个典型的前后端分离的系统
前端工程化- Webpack(Taro)
后端- Nodejs
数据库- MongoDB
Nginx- 静态服务, 反向代理

* 特点
1. 高效的利用系统资源
2. 快速的启动时间
3. 一致的运行环境
4. 持续交付和部署
5. 更轻松的迁移

# Docker 中的三个重要概念
1. 镜像Image
面向Docker的只读模板(类比 类的概念)
2. 容器Container
镜像的运行实例(类比 实例的概念)
3. 仓库(Registry)
存储镜像的服务器(类比 github代码仓库)

# Docker安装
1. 申请云服务器
2. 安装过程(将docker安装在云服务器上)

```bash
# apt升级
sudo apt-get update
# 添加相关软件包
sudo apt-get install \
  apt-transport-https \
  ca-certificates \
  curl \
  software-properties-common
# 下载软件包的合法性,需要添加软件源的 GPG 密钥
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
# source.list 中添加 Docker 软件源
sudo add-apt-repository \
   "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# 安装 Docker CE
sudo apt-get update
sudo apt-get install docker-ce
# 启动 Docker CE
sudo systemctl enable docker
sudo systemctl start docker
# 建立 docker 用户组(附加)
sudo groupadd docker  # 添加docker用户组
sudo usermod -aG docker $USER # 将登陆用户加入到docker用户组中
newgrp docker     # 更新用户组
docker ps    # 测试docker命令是否可以正常使用
# Helloworld测试
docker run hello-world
```

关于权限的问题:
docker进程使用Unix Socket而不是TCP端口。而默认情况下，Unix socket属于root用户，需要root权限才能访问。
docker守护进程启动的时候，会默认赋予名字为docker的用户组读写Unix socket的权限，因此只要创建docker用户组，并将当前用户加入到docker用户组中，那么当前用户就有权限访问Unix socket了，进而也就可以执行docker相关命令.
3. 镜像加速
```bash
sudo vi /etc/docker/daemon.json
```
写入如下:
```
{
    "registry-mirrors": [
        "https://dockerhub.azk8s.cn",
        "https://reg-mirror.qiniu.com"
    ]
}
```
重启docker:
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```
# Docker常用命令
```bash
# 下载镜像：docker pull <镜像名:tag>    如：下载centos镜像
docker pull centos
docker pull sameersbn/redmine:latest
# 查看已下载镜像
docker images
# 删除容器
docker rm <容器名 or ID>
# 查看容器日志
docker logs -f <容器名 or ID>
# 查看正在运行的容器
docker ps
# 查看所有的容器，包括已经停止的。
docker ps -a 
# 删除所有容器
docker rm $(docker ps -a -q)
# 停止、启动、杀死指定容器
docker start <容器名 or ID> # 启动容器
docker stop <容器名 or ID> # 启动容器
docker kill <容器名 or ID> # 杀死容器
# 后台运行 docker run -d <Other Parameters>
docker run -d -p 127.0.0.1:33301:22 centos6-ssh
# 暴露端口： 一共有三种形式进行端口映射
docker -p ip:hostPort:containerPort # 映射指定地址的主机端口到容器端口
# 例如：docker -p 127.0.0.1:3306:3306 映射本机3306端口到容器的3306端口
docker -p ip::containerPort # 映射指定地址的任意可用端口到容器端口
# 例如：docker -p 127.0.0.1::3306 映射本机的随机可用端口到容器3306端口
docer -p hostPort:containerPort # 映射本机的指定端口到容器的指定端口
# 例如：docker -p 3306:3306 # 映射本机的3306端口到容器的3306端口
# 映射数据卷
docker -v /home/data:/opt/data # 这里/home/data 指的是宿主机的目录地址，后者则是容器的目录地址
```

# SSH 远程操作服务器
SSH(Secure Shell Protocol),OpenSSH是SSH协议的免费开源实现.
OpenSSH包含服务端程序和客户端工具,用来加密远程控件和文件传输过程中的数据.因而该工具可以帮助我们在互联网上安全地访问远程服务器,因为SSH的所有连接都是加密的.OpenSSH提供了安全隧道功能和多种身份验证方法,支持SSH协议的所有版本.

1. SSH连接配置
Linux下SSH分为客户端openssh-client和服务器openssh-server.客户端的SSH程序是用SSH来连接别的电脑的.服务器的SSH程序是让别的电脑通过SSH连接本机的.(客户端openssh-client通常Ubuntu会默认安装)
```bash
sudo apt install openssh-client # 本地主机运行此条，实际上通常是默认安装client端程序的
sudo apt install openssh-server # 在被连接的服务器运行此条命令安装
sudo service ssh start # 在被连接的服务器启动ssh
systemctl restart sshd.service #重启ssh 服务
sudo ps -e |grep ssh # 查看是否启动ssh
ifconfig # 查看主机ip
```
2. 本地主机连接服务器
本机上运行以下命令来连接远程服务器.使用默认的端口:22
```bash
ssh username@111.229.83.147
# 如果远程服务器的SSH服务不是使用22端口,那么SSH链接时则需要用-p指定端口（如258端口）
ssh -p 258 username@111.229.83.147
# 远程服务其配置了密钥 使用密钥登陆("home/richard/ssh_key"为密钥的绝对路径)
ssh -i "/home/richard/ssh_key" ubuntu@192.168.11.123
# 退出远程服务器
exit 
```
3. 本地主机与远程服务器主机互传文件
* 下载到本地
```bash
scp coke@192.168.1.100:~/Desktop/a.txt ./Desktop

# 下载整个目录
scp -r username@serverip:/sever_path  /local_path
```
* 上传文件到远程服务器
```bash
# 指定端口用大写P
scp -P 258 test.txt john@192.168.1.100:~/

# 上传整个目录
scp -r /local_dir username@serverip:/server_dir
```
4. 使用密钥
所谓"公钥登录"，就是用户将自己的公钥储存在远程主机上。登录的时候，远程主机会向用户发送一段随机字符串，用户用自己的私钥加密后，再发回来。远程主机用事先储存的公钥进行解密，如果成功，就证明用户是可信的，直接允许登录shell，不再要求密码。

* 生成密钥对
```bash
ssh-keygen -t rsa -C "youremail@example.com" 
# -t 表示选择的类型,类型为rsa一种非对称的加密算法(产生公钥和私钥).
# 如果ssh_public_key要绑定github,那么邮箱为注册github的邮箱
```
执行以后会在$HOME目录下生成一个.ssh文件夹,其中包含私钥文件id_rsa和公钥文件id_rsa.pub.

* 复制公钥到服务器
在进行以下配置以后，再进行连接时,就可以免去口令(密码)的输入了
```bash
# 登录远程服务器
ssh yucicheung@10.170.11.147 
# 在服务器上创建.ssh文件夹,如果已经存在就跳过此步
mkdir .ssh 
# 为了保证.ssh文件夹的安全，应取消其他用户对文件夹的所有权限
chmod 700 .ssh
# 退出登录
exit
# 本地主机的公钥复制到远程服务器,作为已认证密钥
scp /home/richard/.ssh/id_rsa.pub ubuntu@192.168.0.1:/home/ubuntu/.ssh/authorized_keys
```
* 修改本地/etc/ssh/sshd_config文件
```bash
vi /etc/ssh/sshd_config
 
RSAAuthentication yes      #开启私钥验证
PubkeyAuthentication yes   #开启公钥验证
```
Note: 在使用云服务器的时候(如腾讯云,可以在它的控制台自己启用ssh密钥),生成密钥之后,我们将它下载到本地,在之后通过ssh访问云服务器的时候使用如下命令.
```bash
# 远程服务自己配置了密钥 本地下载密钥并保存,使用密钥登陆("home/richard/ssh_key"为本地密钥保存的绝对路径)
ssh -i "/home/richard/ssh_key" ubuntu@192.168.11.123
```

# 简单的Nginx服务
1. 拉取官方镜像 - 面向docker的只读模板
```bash
docker pull nginx
```

2. 查看镜像
```bash
docker images nginx
```

3. 由指定镜像创建容器
```bash
# www目录里面放一个index.html
mkdir www
echo 'hello docker' >> www/index.html
# 创建并启动容器 (由nginx 镜像 创建容器)
# -p 指定容器暴露80端口映射到真实主机的8000端口
# -v volume指定当前主机文件夹下文件挂载到容器的某目录下
docker run -p 8000:80 -v $PWD/www:/usr/share/nginx/html nginx
# 后台启动 (-d detach 后台运行,会在终端输出这个容器的uuid)
docker run -p 80:80 -v $PWD/www:/usr/share/nginx/html -d nginx
```

4. 容器操作
```bash
# ff6 是容器ID的前三个字母
# 启动容器
docker start ff6
# 停止容器
docker stop ff6 
# 重启容器
docker restart ff6
```

5. 查看进程
```bash
docker ps
# 查看全部
docker ps -a
```

6. 伪终端
```bash
# exec 用于在运行中的容器中执行命令
# 选项
# -d 分离模式即在后台运行
# -i 即使没有附加也保持STDIN标准输入打开
# -t 分配一个伪终端 /bin/bash  shell 命令终端
docker exec -it ff6 /bin/bash
```

7. 删除
```bash
# 删除容器
docker rm ff6
# 删除镜像
docker rmi nginx
```

# Dockerfile 定制镜像
镜像的定制实际上就是定制每一层所添加的配置,文件.如果我们可以把每一层修改,安装,构建,操作的命令都写入一个脚本.用这个脚本来构建,定制镜像,那么之前提及的无法重复的问题,镜像构建透明性的问题,体积问题就都会解决.这个脚本就是Dockerfile.

总结: 脚本创建镜像
## Dockerfile 脚本常用指令
1. FROM
指明 构建的新镜像来自于哪个基础镜像
```bash
FROM nginx:latest
```
2. RUN
构建镜像时运行的Shell命令,这个shell命令是在docker进程内执行的,不是宿主机上
```bash
RUN echo '<h1>Hello world</h1>' > /usr/share/nginx/html/index.html
```
3. CMD
启动容器时,在容器内执行的Shell命令,不是宿主机上
```bash
CMD ["node", "app.js"]
```
4. ADD
拷贝当前宿主机下的文件或目录到镜像中
```bash
# 拷贝当前文件夹下的目录到 镜像的 /app目录下
ADD . /app
```
5. WORKDIR
进入app目录下面,类似cd
```bash
WORKDIR /data
```
6. EXPOSE
声明容器对外暴露的端口
```bash
EXPOSE 3000
```

## 定制自己的web服务器镜像
### 修改Dockerfile
```bash
# vi Dockerfile
FROM nginx:latest
RUN echo '<h1>Hello world</h1>' > /usr/share/nginx/html/index.html
```

### 定制镜像
```bash
# 创建命名为nginx标签为richard 的nginx镜像 在当前文件夹下(这个.表示在当前文件下查找Dockerfile)
docker build -t nginx:richard .
```

### 运行
启动并生成一个docker容器
```bash
docker run -p 8000:80 nginx:richard
```

## 定制Nodejs镜像
### 新建node项目
```bash
npm init -y
npm i koa -s
```
app.js
```
const Koa = require('koa')
const app = new Koa()
app.use(ctx => {
   ctx.body = 'Hello Docker'
})
app.listen(3000, () => {
   console.log('app started at http://localhost:3000/')
})
```

### 定制Dockerfile
```bash
# 制定 node镜像的版本
FROM node:10-alpine
# 拷贝当前目录下面的文件到app目录下
ADD . /app/
# 进入到app目录下面,类似cd
WORKDIR /app
# 安装依赖
RUN npm install
# 对外暴露的端口
EXPOSE 3000
# 程序启动脚本
CMD ["node", "app.js"]
```

### 定制镜像
```bash
# 创建镜像
docker build -t mynode . 
# 根据镜像mynode创建并启动容器
docker run -p 3000:3000 -d mynode
```

## 定制PM2镜像
pm2是node进程管理工具,可以用它来管理node进程,并查看node进程的状态,支持性能监控,进程守护,负载均衡等功能.
### pm2 使用简介
```bash
# 全局安装
npm install -g pm2
# 启动进程/应用 
pm2 start bin/www 或 pm2 start app.js

# 重命名进程/应用 
pm2 start app.js --name wb123

# 添加进程/应用 watch 
pm2 start bin/www --watch

# 结束进程/应用 
pm2 stop www

# 结束所有进程/应用
pm2 stop all

# 删除进程/应用 
pm2 delete www

# 删除所有进程/应用 
pm2 delete all

# 列出所有进程/应用 
pm2 list

# 查看某个进程/应用具体情况
pm2 describe www

# 查看进程/应用的资源消耗情况 
pm2 monit

# 查看pm2的日志 
pm2 logs

# 查看某个进程/应用的日志
pm2 logs www

# 重新启动进程/应用 
pm2 restart www

# 重新启动所有进程/应用 
pm2 restart all
```

### 新建.dockerignore
新建.dockerignore文件,增加如下代码
```bash
# docker 会忽略 node_modules文件夹
node_modules
```

### pm2 运行脚本
```js
// process.yml
apps:
 - script : app.js
   instances: 2
   watch : true
   env   :
     NODE_ENV: production
```

### 新建Dockerfile
```bash
# Dockerfile
FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install
EXPOSE 3000
#pm2在docker中使用命令为pm2-docker
CMD ["pm2-runtime", "start", "process.yml"]
```

### 定制镜像
```bash
docker build -t mypm2 .
```

### 创建并启动容器
```bash
docker run -p 3000:3000 -d mypm2
```

# Docker-compose
Docker-compose 是Docker官方开源的项目,负责实现对Docker容器集群的快速编排(一次启动多个容器).
## 安装稳定版
```bash
# 安装
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# 可执行
$ sudo chmod +x /usr/local/bin/docker-compose
# 软链接
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

## 新建docker-compose.yml文件
docker-compose.yml文件描述了docker-compose按顺序启动的容器的相关配置.
例子如下
```bash
version: '3.1'
services:
    mongo: # 服务名
        image: mongo # 镜像名 
        restart: always
        ports:
            - 27017:27017
    mongo-express:
        image: mongo-express
        restart: always
        ports:
        - 8000:8081
```

## docker-compose命令
必须在docker-compose.yml所在的文件夹下启动如下命令
```bash
# 开启
docker-compose up
# 关闭
docker-compse down
```

# 构建前后端分离的项目
项目基本目录结构: 
```bash
-   backend  # 后端代码
        -models # 数据库
-   frontend # 前端代码
-   nginx/conf.d # nginx 静态服务配置
        -   docker.conf
```
1. nginx静态服务配置
/nginx/conf.d/default.conf
```bash
# nginx 静态服务
server {
    listen       80;
    location / {
        root   /var/www/html;
        index  index.html index.htm;
    }

    location ~ \.(gif|jpg|png)$ {
        root /static;
        index index.html index.htm;
    }

    # 反向代理
    # http://app-pm2 是docker内部的一个子网域名 对应Docker-compose.yml里面的service 下面的每个 service name
    location /api {
            proxy_pass  http://app-pm2:3000;
            proxy_redirect     off;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```
2. docker-compose.yml
新建 /docker-compose.yml
之后使用docker-compose up 命令执行该脚本,完成创建镜像,启动容器的一系列工作.
```bash
version: '3.1'
services:
  app-pm2:
      container_name: app-pm2
      #构建容器
      build: ./backend
      ports:
        - "3000:3000"
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  mongo-express:
    image: mongo-express
    restart: always 
    ports:
      - 8081:8081
  nginx:
    restart: always
    image: nginx
    ports:
      - 8091:80
    volumes:
      # 将主机nginx的配置文件 挂载到 nginx镜像的目录下
      - ./nginx/conf.d/:/etc/nginx/conf.d 
      # 将主机前端代码 挂载 到 nginx镜像目录下
      - ./frontend/dist:/var/www/html/
      # 将主机静态文件目录 挂载到nginx镜像的目录下
      - ./static/:/static/
```
3. process.yml
新建/backend/process.yml,
pm2启动之后要执行的脚本
```bash
apps:
 - script : server.js
  instances: 2
  watch : true
  env   :
    NODE_ENV: production
```
4. Dockerfile
新建/backend/Dockerfile用于定制PM2镜像,并执行一些命令.
```bash
FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org/ && \  
   npm i
EXPOSE 3000
#pm2在docker中使用命令为pm2-docker
CMD ["pm2-runtime", "start",  "process.yml"]
```
5. .dockerignore
新建/backend/.dockerignore文件
用于添加文件到镜像时,忽略node_module文件夹.
```bash
node_module
```
6. 数据库配置
用于配置后端数据库
/backend/models/conf.js
```bash
module.exports = {
    url: "mongodb://mongo:27017", # docker 内部的mongo域名, 对应docker-compose.yml中声明的名字
    dbName: 'taro'
}
```

# CI持续集成
代码提交到代码库(production分支), 服务器就自动拉取代码更新.
使用到了github的webhooks,来获取github代码库的更新的相关信息,在执行服务器代码拉取最新代码,完成服务器代码部署.
## webhooks
1. 在github的代码库里新建一个webhooks
2. 新建本地代码webhooks.js获取push操作.
3. 新建deploy-dev.sh 用于webhooks执行后,检查到代码库的更新,然后就会去执行deploy-dev.sh脚本,这个脚本会去执行部署到服务器的一些操作(拉取代码, 重新编译docker容器)

### Add webhook
在github代码库里面添加webhooks
settings>add webhooks

1. Payload URL
接收webhook POST请求的服务器地址, 我们自己的web应用的url
2. Content type
指定我们从github接收的数据类型.
3. Secret
为保证安全设置的密码,在我们的web应用请求webhooks,也需要设置相同的secret.
4. Events
Events是webhook的核心。只要对存储库执行某项操作，就会触发这些webhook，服务器的有效负载URL会拦截并执行操作。

### 服务端接受webhooks 回调信息,并做出操作
```js
var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhooks', secret: 'myHashSecret' })
// 上面的 secret 保持和 GitHub 后台设置的一致
// spawn 用于执行命令
function run_cmd(cmd, args, callback) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
    child.stdout.on('end', function () { callback(resp) });
}
// debug用
// run_cmd('sh', ['./deploy-dev.sh'], function(text){ console.log(text) });

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
    })
}).listen(7777,() =>{
    console.log('WebHooks Listern at 7777');
})

handler.on('error', function (err) {
    console.error('Error:', err.message)
})


handler.on('*', function (event) {
    console.log('Received *', event.payload.action);
    //   run_cmd('sh', ['./deploy-dev.sh'], function(text){ console.log(text) });
})
 
handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
        // 分支判断
        if(event.payload.ref === 'refs/heads/master'){
            console.log('deploy master..')
            run_cmd('sh', ['./deploy-dev.sh'], function(text){ console.log(text) });

        }
})

handler.on('issues', function (event) {
    console.log('Received an issue event for % action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
})
```