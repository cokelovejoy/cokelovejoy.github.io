---
title: nginx
date: 2020-03-18 11:15:23
tags:
---
# Ubuntu install nginx
```bash
sudo apt-get install nginx
sudo apt-get update
sudo apt-get upgrade
# 查看nginx版本
sudo nginx -v
# 检查Nginx服务的状态和版本
sudo systemctl status nginx
```

# 文件目录
配置文件 : /etc/nginx/nginx.conf
程序文件 : /usr/sbin/nginx
日志 : /varlog/nginx
默认虚拟主机 : /var/www/html (放网页的位置)

# 管理Nginx服务
```bash
# 启动
sudo /etc/init.d/nginx start
# 停止
sudo /etc/init.d/nginx stop
# 重启
sudo /etc/init.d/nginx restart
# 状态
sudo /etc/init.d/nginx status
# 查看端口占用
lsof -i:80
# 测试nginx.conf文件
/usr/sbin/nginx -t -c /etc/nginx/nginx.conf
```
# conf配置文件
```bash
server {
    listen      80;
    server_name localhost;
    index index.html index.htm index.php;
    root /var/www/html/statium;
    location / {
        root /var/www/html/statium;
        try_files $uri $uri/ /index.html last;
        index index.html;
    }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root html;
    }
}
```
# 使用systemctl管理nginx服务
```bash
# 启动
sudo systemctl start nginx
# 停止
sudo systemctl stop nginx
# 重启
sudo systemctl restart nginx
# 更改配置后重新加载Nginx服务：
sudo systemctl reload nginx
# 禁用在系统启动时启动nginx
sudo systemctl disable nginx
# 重新启用nginx
sudo systemctl enable nginx
```
