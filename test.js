let json = [
    {
        a: "1",
        b: "",
        c: "26"
    },
    {
        a: "",
        b: "2",
        c: "26"
    },
    {
        a: "1",
        b: "",
        c: "27"
    },
    {
        a: "",
        b: "2",
        c: "27"
    }
]
let array1 = []
let array2 = []
json.forEach((item) => {
    if(item.c=="26") {
        array1.push(item)
    }else {
        array2.push(item)
    }
})
let obj = {}
array1.forEach((item) => {
    obj.c = item.c
    if (item.a) {
        obj.a = item.a
    }
    if (item.b) {
        obj.b =item.b
    }
})
console.log(obj)

json.reduce((total, current) => {

}, {a:"", b:"", c})