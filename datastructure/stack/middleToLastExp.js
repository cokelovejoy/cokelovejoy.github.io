/**
 * 中缀表达式转后缀表达式
 * 要求： 输入一个中缀表达式的数组，输出它的后缀表达式。
 * 实现：
 *  1. 定义数组postfixList, 用于存储后缀表达式，定义一个栈用来存储运行算符和左括号。
 *  2. 遇到数字时，直接放入postfixList中
 *  3. 遇到左括号时，左括号直接入栈
 *  4. 遇到右括号时，把栈顶的元素弹出并保存到postList数组中，直到遇到左括号，最后弹出左括号。这一步的目的是为了把括号中的数存到数组。
 *  5. 遇到运算符时，如果当前运算符的优先级高于栈顶的运算符优先级，则把这个运算符入栈。相反当前运算符的优先级小于栈顶的运算符的优先级时，把栈顶的运算符弹出，一直弹到栈顶的运算符的优先级小于当前运算符，同时将弹出的运算符加入到postList数组中。
 *  6.for 循环结束之后，栈里可能还有元素，都弹出放入到postList数组中。
 * 例子：输入： (1+(4*5-3))-3+4       中序表达式['(','1', '+', '(', '4', '*', '5', '-', '3', ')', ')', '-', '3', '+', '4']
 *       输出：['1', '4', '5', '*', '3', '-', '+', '3','-', '4', '+']
 */

 // 定义运算符的优先级，映射

 const Stack = require('./useArray')
 const priorityMap = {
     '+': 1,
     '-': 1,
     '*': 2,
     '/': 2
 }


 function infixExpTopostExp(exp) {
    let stack = new Stack()
    let postfixList = []
    for (e of exp) {
        if (!isNaN(e)) {
            // 遇到数字，直接放入postfixList数组
            postfixList.push(e)
        } else if (e === '(') {
            // 遇到左括号，直接放入栈中。
            stack.push(e)
        } else if (e === ')') {
            // 遇到右括号，弹出栈中的运算符并保存到postfixList数组中，直到弹出的是左括号就停止。
            while(stack.top() !== '(' ) {
                postfixList.push(stack.pop())
            }
            // 栈顶元素是左括号时
            stack.pop()
        } else {
            // 遇到运算符时, 如果栈顶的运算符优先级高于或等于当前运算符的优先级，就弹出栈顶的元素，并存到postfixList数组
            while(!stack.isEmpty() && ['+', '-', '*', '/'].includes(e) && priorityMap[stack.top()] >= priorityMap[e]) {
                postfixList.push(stack.pop())
            }
            // 相反 当前的运算符就要压入到栈中
            stack.push(e)
        }
    }
    // 栈中可能还有元素，都存到postfixList中。
    while (!stack.isEmpty()) {
        postfixList.push(stack.pop())
    }
    return postfixList
 }

 console.log(infixExpTopostExp(['(','1', '+', '(', '4', '*', '5', '-', '3', ')', ')', '-', '3', '+', '4']))



