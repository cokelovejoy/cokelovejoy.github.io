---
title: Docker
date: 2020-02-25 11:31:48
tags:
---

# Docker是什么?
一次封装,到处执行(不用配置环境,任何环境下都能运行应用,极大简化部署)
基于lunux的高效,敏捷,轻量级的容器(轻量虚拟)的方案

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
sudo usermod -a docker $USER # 将登陆用户加入到docker用户组中
newgrp docker     # 更新用户组
docker ps    # 测试docker命令是否可以使用sudo正常使用
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
ssh-keygen -t rsa # -t 表示选择的类型,类型为rsa一种非对称的加密算法(产生公钥和私钥).
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
# 远程服务其配置了密钥 使用密钥登陆("home/richard/ssh_key"为本地密钥保存的绝对路径)
ssh -i "/home/richard/ssh_key" ubuntu@192.168.11.123
```