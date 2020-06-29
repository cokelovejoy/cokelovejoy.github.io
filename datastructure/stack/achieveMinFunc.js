/**
 * 实现有min方法的栈，min方法用来返回栈中的最小值
 * 原理：用两个栈，一个栈用来保存数据元素，一个栈用来保存最小值
 *       用来保存最小值的栈永远会将最小值放在栈顶。
 *  数据入栈的时候，会将数据压入数据栈中，将最小值栈的栈顶元素与压入的数据进行比较。
 *      如果最小值栈为空，或者压入的数据小于最小值栈的栈顶元素，则将这个数据压入最小值栈中。
 *      如果压入的数据大于最小值的栈顶元素，则将最小值栈的栈顶元素再压入栈中，这样做的目的是为了让两个栈的数据个数保持一致，当pop操作之后时，最小值栈的栈顶仍然时最小值。
 */
const Stack = require('./useArray')

function MinStack() {
    let data_stack = new Stack()
    let min_stack = new Stack()
    
    this.push = function (item) {
        data_stack.push(item)
        if (min_stack.isEmpty() || item < min_stack.top()) {
            min_stack.push(item)
        } else {
            min_stack.push(min_stack.top())
        }
    }
    // 弹出两个栈中的元素
    this.pop = function() {
        data_stack.pop()
        min_stack.pop()
    }
    this.min = function () {
        return min_stack.top()
    }
}

let minstack = new MinStack()
minstack.push(5)
minstack.push(3)
minstack.push(6)
minstack.push(1)

console.log(minstack.min())
minstack.pop()
console.log(minstack.min())