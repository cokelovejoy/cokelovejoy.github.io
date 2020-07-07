// 节点类
// 无头链表

function LinkList() {
    // 定义节点
    var Node = function (data) {
        this.data = data
        this.next = null
    }
    var length = 0  // 长度
    var head = null // 头节点
    var tail = null // 尾节点
    // 增加节点
    this.append = function(data) {
        // 创建新节点
        var node = new Node(data)
        // 如果是空链表
        if (head == null) {
            head = node
            tail = head
        } else {
            // 尾节点的next域指向新创建的节点
            tail.next = node
            // 新创建的节点成为尾节点
            tail = node
        }
        // 长度加1
        length += 1
        return true
    }
    // 打印节点
    this.print = function () {
        var curr_node = head
        while (curr_node) {
            console.log(curr_node.data)
            curr_node = curr_node.next
        }
    }
    // 插入节点
    // 思路： 插入指定位置的节点，先找到该index对应的节点的前一个节点，分开节点，然后再连起来
    this.insert = function (index, data) {
        if (index < 0 || index > length) {
            // 如果插入的位置不合法， 负数或者超过了链表的长度
            return false
        } else if (index == length) {
            // 如果插入的位置在末尾，直接append
            return this.append(data)
        } else {
            // 如果插入的位置在中间
           
            var  new_node = new Node(data)
            if (index == 0) {
                new_node.next = head
                head = new_node
            } else {
                var insert_index = 1
                var curr_node = head
                // 将curr_node 一直往下移， 直到 insert_index  == index
                while (insert_index < index) {
                    curr_node = curr_node.next
                    insert_index += 1
                }
                // 插入节点的顺序：curr_node--> new_node --> next_node 
                // 必须先用next_node 保存 当前insert_index 所对应的node的下一个node
                var next_node = curr_node.next
                // 将curr_node的next指向新增的node节点
                curr_node.next = new_node
                // 将新增的节点的next指向next_node
                new_node.next = next_node
            }
            // 增加成功之后，长度要加1
            length += 1
            return true
        }
    }

    // 删除节点
    // 思路：删除指定位置的节点，先找到该index对应的节点的前一个节点，然后一样是节点的拼接操作
    this.remove = function (index) {
        // 判断index是否合法
        if (index < 0 && index > length) {
            return null
        } else {
            var del_node = null // 要删除的node
            // index在length之内
            if (index === 0) {
                // 如果删除的是第一个节点，只需要将head指向下一个节点。
                del_node = head
                head = head.next 
            }
        }

    }
}

var link = new LinkList()
link.append(2)
link.append(4)
link.append(8)
link.print()
link.insert(1, 3)
link.print()

// 作业：
// 1. 链表逆序打印
// 2. 拼接两个链表
// 3. 查找单向链表中倒数第k个节点
// 4. 查找单向链表的中间节点
// 5. 实现双向链表

// 作业
// 两个集合取交集
// 支持负数
// 查找不重复的数

// 作业
// 求一棵树的镜像 每个节点的左右节点互换
// 非递归方式实现前中后序遍历 递归转为非递归，要使用while循环
// 寻找两个节点的最近公共祖先
// 分层打印二叉树
// 输出指定层的节点的个数

// 作业
// 实现最大堆
// 实现最小堆