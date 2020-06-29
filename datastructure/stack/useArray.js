module.exports = function Stack() {
    let items = []
    // push 在栈顶新增一个元素， 并返回这个元素
    this.push = function (val) {
        return items.push(val)
    }
    // pop 删掉栈顶元素，并返回这个元素
    this.pop = function () {
        return items.pop()
    }
    // top 返回栈顶元素
    this.top = function () {
        return items[items.length - 1]
    }
    // isEmpty 判断栈是否为空
    this.isEmpty = function () {
        return items.length === 0
    }
    // size 返回栈里元素的个数
    this.size = function () {
        return items.length
    }
    // clear 清空栈
    this.clear = function () {
        items = []
    }
}
