/**
 * 实现队列
 * 
 */
module.exports = function Queue() {
    var items = []
    // 向队列的尾部添加一个元素
    this.enqueue = function (item) {
        items.push(item)
    }
    // 移除队列头部的元素
    this.dequeue = function () {
        return items.shift()
    }
    // 返回队列头部的元素
    this.head = function () {
        return items[0]
    }
    // 返回队列尾部的元素
    this.tail = function () {
        return items[items.length-1]
    }
    // 返回队列长度
    this.size = function () {
        return items.length
    }
    // 清空队列
    this.clear = function () {
        items = []
    }
    // 判断队列是否为空
    this.isEmpty = function () {
        return items.length === 0
    }
}


// 斐波那契数列
/**
 * 斐波那契数列的前两项是1，1，此后的每一项都是该项前面两项之和。
 * 即f(n) = f(n-1)+ f(n-2)
 * 求斐波那契数列数列的第n项
 */

// 使用队列实现栈： 使用两个队列是实现栈。
/**
 * 两个队列分别为queue_1, queue_2 
 * push方法： 实现push方法，如果两个队列都为空，那么默认向queue_1里添加数据，如果有一个不为空，则向这个不为空的队列里添加数据
 * top 方法： 两个队列，或者都为空，或者有一个不为空，只要返回不为空的队列的尾部元素即可。
 * pop 方法： pop方法要删除的是栈顶元素，但这个栈顶元素其实是队列的尾部元素，每做一次pop操作时
 *            将为不空的队列里的元素依次删除并放入到另一个队列中直到遇到队列中只剩下一个元素，删除这个元素，其余的元素都跑到之前为空的队列中了。
 * 额外定义两个变量： data_queue始终指向不为空的队列，empty_queue始终指向为空的队列。
 */ 

 // 打印杨辉三角
 /**
  * 两种思路： 1.对于较复杂的问题，可以尝试从边界情况出发。
  *           2.从中间情况出发。  
  * 
  * 
  * 
  */
 // 用两个栈实现一个队列

 // 迷宫问题
