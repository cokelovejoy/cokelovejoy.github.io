/** 
 * 中缀表达式： 1+2 => [1, '+', 2]
 * 逆波兰表达式也叫后缀表达式，将复杂表达式转换为可以依靠简单的操作得到计算结果的表达式
 * 例如: 1+2+3 => [1, 2, 3, '+']
 * 特点: 数在前，符号在后
 * 目标: 利用栈实现后缀表达式
 * 原理: 1. 如果元素不是+-/*中的某一个，就压入栈中
 *       2. 如果元素是 +-/*中的某一个，就从栈中连续弹出两个元素，并对这两个元素进行计算，将计算结果压入栈
 *       3. 然后继续进行上述两个压栈操作，直到所有元素遍历完，栈中只有一个元素，这个元素就是整个表达式的结果 
*/

const Stack = require('./useArray')

function cal_exp(exp) {
    let expStack = new Stack()
    for (let i of exp) {
        if (['+', '-', '*', '/'].indeOf(i) == -1) {
            // 不是 + - * / ，是数字，就压入栈中
            expStack.push(i)
        } else {
            let a = expStack.pop()
            let b = expStack.pop()
            let res
            switch (i) {
                case '+':
                    res = a + b
                    break
                case '-':
                    res = b - a
                    break
                case '*':
                    res = a * b
                    break
                case '/':
                    res = b / a
                    break
            }
            expStack.push(res)
        }
    }
    return expStack.pop()
}

console.log(cal_exp([1, 2, '+']))