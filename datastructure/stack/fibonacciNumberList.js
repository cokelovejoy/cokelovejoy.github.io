/**
 * 斐波那契数列：从1，1，开始之后的每一项都是前两项之和。
 * 使用队列实现斐波那契数列，求数列第n项的数值
 * 实现原理： 使用一个变量index用来计项数，循环使用队列，将队列弹出的值和头部的值之和放入队列中（循环条件index<n-2）
 */
const Queue = require('./queue')
function fibonacciNumberList(n) {
    let queue = new Queue()
    let index = 0
    // 先将1，1入队列
    queue.enqueue(1)    
    queue.enqueue(1)
    while (index < n-2) {
        index += 1
        let sum =  queue.dequeue() + queue.head()
        queue.enqueue(sum)
    }
    // 最后要求的值，要先出队列，然后就是我们要求的值。
    queue.dequeue()
    return queue.head()
}

let res = fibonacciNumberList(8)
console.log(res)