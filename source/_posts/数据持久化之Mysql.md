---
title: 数据持久化之Mysql
date: 2020-01-22 14:36:07
tags:
---

# Node.js中实现数据持久化的多种方法
* 文件系统fs
* 数据库
1. 关系型数据库--mysql
2. 文档型数据库--mongodb
3. 键值对数据库--redis

## 文件系统
原理: 将数据保存在json文件中,通过读取文件,修改文件的方式,完成数据持久化.

```js
// 实现一个文件系统读写数据库
// readline 模块属于node核心模块,可以读取命令行的字符串
const fs = require("fs")
const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
function get(key) {
    fs.readFile("./db.json", (err, data) => {
        const json =JSON.parse(data)
        console.log(json[key])
    })
}
function set(key, value) {
    fs.readFile('./db.json', (err, data) => {
        // 空文件,设置为空对象
        const json = data ? JSON.parse(data) : {}
        json[key] = value
        // 重新写入文件
        fs.writeFile("./db.json", JSON.stringify(json), err => {
            if (err) {
                console.log(err)
            }
            console.log("写入成功!")
        })
    })
}
rl.on("line", function (input) {
    const [op, key, value] = input.split(" ")
    if (op == "get") {
        get(key)
    } else if (op == "set") {
        set(key,value)
    } else if (op == 'quit') {
        rl.close()
    } else {
        console.log("没有该操作")
    }
})
rl.on("close", () => {
    console.log("程序结束")
    process.exit(0)
})
```
## Mysql
### nodeJS操作mysql
#### 安装mysql模块
```bash
npm i mysql --save
```
#### mysql模块基本使用
```js
const mysql = require('mysql')

const config = {
    host: "localhost",
    user: "zhyq",
    password: "123456",
    database: "test"
}
const connect = mysql.createConnection(config)

connect.connect(err => {
    if (err) {
        throw err
    } else {
        console.log("连接成功!")
    }
})

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
    id INT NOT NULL AUTO_INCREMENT,
    message VARCHAR(45) NULL,
    PRIMARY KEY (id))`;
const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
const SELECT_SQL = `SELECT * FROM test`;
connect.query(CREATE_SQL, err => {
    if (err) {
        throw err;
    }
    // 插入数据
    connect.query(INSERT_SQL, "hello,world", (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        connect.query(SELECT_SQL, (err, results) => {
            console.log(JSON.stringify(results));
            connect.end(); // 若query语句有嵌套，则end需在此执行
        })
    });
});
```
ES6写法:
```js
(async () => {
    const mysql = require('mysql2/promise')
    // 连接配置
    const cfg = {
        host: "localhost",
        user: "zhyq",
        password: "123456", // 修改为你的密码
        database: "test" // 请确保数据库存在
    }
    const connection = await mysql.createConnection(cfg)
    let ret = await connection.execute(`
        CREATE TABLE IF NOT EXISTS test (
            id INT NOT NULL AUTO_INCREMENT,
            message VARCHAR(45) NULL,
        PRIMARY KEY (id))
    `)
    console.log('create', ret)
    ret = await connection.execute(`
            INSERT INTO test(message)
            VALUES(?)
    `, ['ABC'])
    console.log('insert:', ret)
    ret = await connection.execute(`
            SELECT * FROM test
    `)
    console.log(JSON.stringify(ret[0]))
    // console.log(ret[1])
    connection.end()
})()    
```
### Mysql详细教程
https://www.runoob.com/mysql/mysql-tutorial.html
### Mysql命令行操作
#### 启动数据库服务（windows）
1. 先进入mysql安装目录
```bash
cd C:\mysql-8.0.11\bin
```
2. 初始化数据库
```bash
mysqld --initialize --console
```
3. 执行完成后会输出root用户的初始默认密码
```
2018-04-20T02:35:05.464644Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: APWCY5ws&hjQ
```
APWCY5ws&hjQ 就是初始密码，后续登录时需要用到，也可以在登录后修改密码。

4. 安装命令
```bash
mysqld install
```
5. 启动mysql 服务命令
```bash
net start mysql
```
#### 登录Mysql
当 MySQL 服务已经运行时，可以通过 MySQL 自带的客户端工具登录到 MySQL 数据库中, 首先打开命令提示符, 输入以下命令:
```bash
mysql -h localhost -u root -p
```
-h: 主机名
-u：用户名
-p：告诉服务器将会使用一个密码来登录, 如果所要登录的用户名密码为空, 可以忽略此选项。

登录本机的Mysql数据库
```bash
mysql -u root -p
```
若密码存在, 输入密码登录, 不存在则直接按回车登录。登录成功后你将会看到 Welcome to the MySQL monitor... 的提示语。

然后命令提示符会一直以 mysq> 加一个闪烁的光标等待命令的输入, 输入 exit 或 quit 退出登录。
#### 管理Mysql的命令
1. 列出 MySQL 数据库管理系统的数据库列表
```bash
# 显示全部：
show databases;
# 显示部分：
show databases like ‘匹配模式’;
# _:匹配当前位置单个字符
# %:匹配指定位置多个字符
```
2. 显示数据库创建语句
```bash
show create database 数据库名字;
```
3. 选择要操作的Mysql数据库，使用该命令后所有Mysql命令都只针对该数据库。
```bash
use databaseName;
```
4. 显示指定数据库的数据表，使用该命令前需要使用 use 命令来选择要操作的数据库。
类似于数据库，每创建一个表会在对应的数据库下创建一些文件（与存储引擎有关）
```bash
# 显示所有的表
show tables;
# 匹配显示表
show tables like ‘匹配模式’
```
5. 显示数据表的属性，属性类型，主键信息 ，是否为 NULL，默认值等其他信息。
```bash
show columns from dataTableName;(表名)
# 效果等同于以下命令
desc tableName;
```
6. 显示数据表的详细索引信息，包括PRIMARY KEY（主键）
```bash
show index from dataTableName;(表名)
```

#### 操作Mysql 库和表的命令
1. 创建数据库
create database  数据库名字[库选项]
库选项：数据库的相关属性
字符集：charset  代表着当前数据库下的所有表存储的数据默认指定的字符集(如果不指定，那么采用DBMS默认的)
校对集：collate 

通过SQL指令创建的数据库->data->opt
```bash
create database 数据库名;
```
2. 删除数据库
```bash
drop database 数据库名;
```
删除之后对应的文件夹也会删除（opt也被删除）
3. 修改数据库
修改的数据库字符集（库选项）：字符集和校对集
```bash
alter database 数据库名字 charset=字符集
```
修改成功后对应的opt会体现
4. 创建数据表
create table 表名(字段名 字段类型 [字段属性],...)[表选项]
	表必须放到对应的数据库下：有两种方式
		1  用‘.’连接：数据库.数据表
		2  在创建表之前先进入到具体的数据库：use 数据库名字
	表选项（表属性）：与数据库类似
	Engine：存储引擎（存储数据的方式，默认是innodb）
	Charset：字符集 只对当前自己表有效
	Collate：校对集
```bash
create table table_name (column_name column_type);
```
例子
```bash
CREATE TABLE IF NOT EXISTS `book`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `title` VARCHAR(100) NOT NULL,
   `author` VARCHAR(40) NOT NULL,
   `date` DATE,
   PRIMARY KEY ( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
5. 复制已有表结构
从已有的表中复制一份（只复制结构，不复制数据）
```bash
create table 新表名 like 表名 
```
只要使用数据库.表名，就可以在任何数据库下访问其他数据库的表

6. 常用的表操作
* 显示表结构
本质：显示表中所包含的字段信息（名字，类型，属性等）
```bash
    Describe 表名
	Desc 表名
	show columns from 表名
```	
* 显示表创建语句
```bash
	show create table 表名
```
* 修改表结构
```bash
# 修改表名：
rename table 旧表名 to 新表名
# 设置表属性
# 若数据库已确定,不要轻易修改表选项(字符集影响不大)
alert table 表名 表选项 [=] 值
# 新增字段
# 字段位置：字段想要存放的位置
# first：在xx之前（最前面），第一个字段
# after字段名：放在某个具体的字段之后（默认的）
alter table 表名 add[column]新字段名 列类型 [列属性] [位置first/after字段名]
# 修改字段名：
alter table 表名 change 旧字段名 新字段名 字段类型[列属性][新位置]
# 修改字段类型（属性）
alter table 表名 modify 字段名 [新属性][新位置]
# 删除字段
alter table 表名 drop 字段名
	
```
6. 删除数据表
```bash
drop table tableName;
# 可同时删除多个表
drop table 表名[表名2...] 
```
#### 操作数据的命令
本质是sql语句
1. 插入数据
数据是字符型，必须使用单引号或者双引号，如："value"。
向表中指定字段插入数据
insert into 表名[(字段列表)] values (对应字段列表)

向表中所有字段插入数据
inset into 表名 values(对应表结构)
```bash
INSERT INTO table_name ( field1, field2,...fieldN )
                VALUES ( value1, value2,...valueN );
```
例子
NOW() 是一个 MySQL 函数，该函数返回日期和时间.
```bash
INSERT INTO book (runoob_title, runoob_author, submission_date)
            VALUES ("mysql", "richard", NOW());
```
2. 查询数据
查询表中全部数据:
select * from 表名  * 表示匹配所有字段
查询表中部分字段: (mysql中没有==符号）
select 字段列表/* from 表名 where 字段名 = 值
例子:
```bash
SELECT column_name,column_name
FROM table_name
[WHERE Clause]
[LIMIT N][ OFFSET M];
```
查询语句中使用一个或者多个表，表之间使用逗号(,)分割，并使用WHERE语句来设定查询条件。
SELECT 命令可以读取一条或者多条记录。
使用星号（*）来代替其他字段，SELECT语句会返回表的所有字段数据
使用 WHERE 语句来包含任何条件。
使用 LIMIT 属性来设定返回的记录数。
通过OFFSET指定SELECT语句开始查询的数据偏移量。默认情况下偏移量为0。

例子
返回数据表 books 的所有记录
```bash
select * from books;
```
3. 更新数据
将数据进行修改(通常是修改部分字段数据)
updata 表名 set 字段名=新值[where条件] 
如果没有where条件，那么所有的表中对应的那个字段都会被修改成统一值
例子:
```bash
UPDATE table_name SET field1=new-value1, field2=new-value2
[WHERE Clause];
```
同时更新一个或多个字段, WHERE 子句中指定任何条件。

例子
```bash
UPDATE books SET title='学习 C++' WHERE id=3;
```
4. 删除数据
delete from 表名 [where条件]  
如果没有where条件，意味着系统会自动删除该表所有数据
例子:
```bash
DELETE FROM table_name [WHERE Clause];
```
例子
```bash
DELETE FROM books WHERE id=3;
```
5. 主键(primary key)
* 创建主键
随表主键:
1：在需要当做主键的字段后面增加primary key
2：在所有字段之后增加primary key选项
表后增加:
alter table 表名 add primary key(字段)
* 查看主键
1：查看表结构
2：查看表的创建语句
* 删除主键
alter table 表名 drop primary key
* 复合主键
主键约束:
主键一旦确定，那么对对应的字段有数据要求
1：当前字段对应的数据不能为空
2：当前字段对应的数据不能有任何重复
* 主键分类
采用的是主键所对应的字段的业务意义分类
业务主键：主键所在的字段具有业务意义
逻辑主键：自然增长的整型

* 自动增长(auto_increment)
使用自动增长:
在字段之后增加一个属性 auto_increment
插入数据：触发自动增长，不能给定具体值


#### 高级数据操作

1. 新增数据
* 多数据插入
	insert into表名 [(字段列表)] vlues(值列表),(值列表)...
* 主键冲突解决方案
1：主键冲突更新
insert into 表名[(字段列表)]values(值列表)on duplicate key update 字段=新值
2：主键冲突替换
干掉原来的数据，重新插入进去
replace into[(字段列表)]values(值列表)
* 蠕虫复制
insert into 表名 [(字段列表)]select*/字段列表 from 表

2. 更新数据
1：通常一定是跟随条件更新
update 表名 set 字段名=新值 where 判断条件
2：如果没有条件，是全表更新数据，但可以用limit来限制更新数量
update 表名 set字段名=新值[where 判断条件]limit 数量
3. 删除数据
1：尽量不要全部删除，应该使用where进行判定
2：可以使用limit来限制要删除的具体数量

delete删除数据的时候无法重置auto_increment
重置自增长的语法：
truncate 表名;  ==》drop===》create
4. 查询数据
select select选项 字段列表 from数据源 where条件 group by 分组 having 条件 order by 排序 limit限制
* select选项：系统该如何对待查询得到的结果
all：默认的 表示保存所有的记录
distinct：去重 只留一条
* 字段列表：需要将同名的改为不同的 
语法：字段名[as]别名
* from数据源
单表数据: from 表名
多表数据: from 表1,表2.......
动态数据: from (select 字段列表 from表)as 别名
* where子句
* group by子句
分组统计: group by 字段名
多分组:   group by字段1,字段2;
分组排序 (默认是升序): 	group by[asc|desc],字段[dsc|desc]
回溯统计: group by 字段[asc|desc]with rollup;
* having子句  (本质和where一样)	
强调：having在group by之后  group by 在where之后
* order by子句
order by 字段[asc|desc] //asc升序  默认的
order by 字段1 规则, 字段2 规则
* limit子句  (限制获取的数量，从第一条到指定的数量)
limit 数量
* 分页
limit offset,length; //offset 偏移量：从哪开始 ,length具体获取多少条记录
### ORM(Object Relation Mapping) - Sequlize