
/** 约瑟夫环
 * 有一个数组a[100]存放0-99，要求每隔两个数删除一个数，到末尾时循环至开头继续进行，求最后一个被删除掉的数。
 * 
 */
const Queue = require('./queue')
function josephHandler(array) {
    let queue = new Queue()
    let index = 0
    // 先把数组中的元素都入队列
    for (let i=0; i<array.length; i++) {
        queue.enqueue(array[i])
    }
    // 一直弹出元素，直到队列只有一个元素。
    while (queue.size() !== 1) {
        index += 1
        let item = queue.dequeue()
        // 每个两个要删除一个，那么就是对3取模为0 的要被删除，不为0 的要重新添加到队列。
        if (index % 3 !== 0) {
            queue.enqueue(item)
        }
    }
    return queue.head() 
}

let arrayData = []
for (let i=0; i<100; i++) {
    arrayData.push(i)
}
let value = josephHandler(arrayData)
console.log(value)