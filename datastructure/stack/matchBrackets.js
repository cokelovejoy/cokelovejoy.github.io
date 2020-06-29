const Stack = require('./useArray')
/**
 * 判断字符串中的括号是否匹配
 * 先判断左括号，如果遇到左括号就push到栈中
 * 如果时右括号，先判断栈是否为空，为空则不合法，栈不为空，则弹出栈顶元素
 * 最后判断栈是否为空
 */
function is_leagl_brackets(string) {
    let stack = new Stack()
    for (let i of string) {
        console.log('i: ', i)
        if (i === '(') {
            stack.push(i)
        }
        if (i === ')') {
            if (stack.isEmpty()) return false
            stack.pop()
        }
    }
    return stack.isEmpty()
}

console.log(is_leagl_brackets('(123)(23)'))