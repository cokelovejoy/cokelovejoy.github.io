---
title: Vue源码学习之工具函数
date: 2020-05-20 09:44:34
tags:
---


# Vue源码之工具函数

## toNumber
* Convert an input value to a number for persistence.
* If the conversion fails, return original string.
```js
function toNumber (val) {
    const n = parseFloat(val)
    return isNaN(n) ? val : n
}
```
## toString

```js
// Get the raw type string of a value, e.g., [object Object].
const _toString = Object.prototype.toString

// Strict object type check. Only returns true
// for plain JavaScript objects.
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}
// Convert a value to a string.
function toString (val) {
    return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString == _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
}
```
## isObject
```js
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
```

## looseEqual
Check if two values are loosely equal - that is if they are plain objects, do they have the same shape?
```js
function looseEqual (a, b) {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
        try {
            const isArrayA = Array.isArray(a)
            const isArrayB = Array.isArray(b)
            if (isArrayA && isArrayB) {
                return a.length === b.length && a.every((e, i) => {
                    return looseEqual(e, b[i])
                })
            } else if (a instanceof Date && instanceof Date) {
                return a.getTime() === b.getTime()
            } else if (!isArrayA && !isArrayB) {
                const keysA = Object.keys(a)
                const keysB = Object.keys(b)
                return keysA.length === keysB.length && keysA.every(key => {
                    return looseEqual(a[key], b[key])
                })
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
    } else {
        return false
    }
}

```