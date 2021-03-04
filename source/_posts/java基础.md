# java基础学习

## JDK, JRE, JVM概念
### JDK
JDK全称 Java SE Development Kit,java标准版开发包，开发java应用程序的开发包，提供编译，运行java程序所需要的各种工具和资源，包括java编译器，java运行时环境，以及常用的java类库。

### JRE
JRE全称 Java Runtime Environment，java运行时环境，运行java程序的必需条件。

### JVM
JVM全称 Java Virtual Machine，java虚拟机，jvm是运行java程序的核心虚拟机。

### 总结
JDK,JRE,JVM三者的关系，是JDK包含JRE，JRE包含JVM。要运行java程序至少需要安装JRE。

## java运行机制
java 是一种静态的特殊编译型语言。
### 编译型语言简介
编译型语言如C, C++, 会使用专门的编译器，针对特定平台（操作系统）直接将源代码一次性编译成可以被该平台硬件执行的机器码，并包装成该平台所能识别的可执行程序的格式，这个转换的过程就称为编译。

编译生成的可执行程序可以脱离开发环境，在特定的平台上运行。
编译型语言的特点：
1. 无法移植到其他平台运行 
2. 一次性编译成机器码，运行效率高 

### 解释型语言简洁
解释型语言如JavaScript，Ruby，Python，使用专门的解释器对源程序逐行解释成特定平台的机器码，并立即执行的语言。解释性语言通常是不会进行整体性的编译和链接处理，解释型语言相当于把编译型语言中的编译和解释的过程混合到一起同时完成。


解释型语言的特点：
1. 解释型语言的程序运行效率通常较低，因为每次执行解释型语言的程序都需要进行一次编译，而且不能脱离解释器独立运行。
2. 跨平台容易，只需要提供特定平台的解释器即可。

### java的特点
java语言既是编译型语言，也是解释型语言。
java程序的执行过程必须经过先编译，后解释两个步骤。

1. javac命令将java代码编译成字节码文件。
2. java命令将字节码文件解释执行成特定平台的机器码。

java语言中负责解释执行字节码文件的就是JVM（java虚拟机）。
所有平台上的JVM向编译器提供相同的编程接口，而编译器只需要面向虚拟机，生成虚拟机能理解的代码，然后由虚拟机来解释执行。

当使用java编译器编译java程序时，生成的是与平台无关的字节码，这些字节码都不面向任何具体的平台，只面向JVM。不同平台上的JVM都是不同的，但他们都提供了相同的接口。

JVM是java程序跨平台的关键部分，只要为不同的平台实现了相应的虚拟机，编译后的java字节码就可以在该平台上运行。

JVM是一个抽象的计算机，和实际的计算机一样，它具有指令集并使用不同的存储区域。它负责执行指令，还要管理数据，内存和寄存器。

## java 程序特点
java是一种面向对象的程序设计语言。
java 程序必须以类（class）的形式存在，类是java程序的最小程序单位。
不允许可执行语句，方法等成分独立存在，所有的程序部分必须放在类定义中。
java 源程序文件名必须和文件中public修饰的类名同名，因此一个java源程序文件里最多一个public类。但是也可以允许有多个其他的非public的类定义。

public类里面必须要有一个main方法，这个main方法写法几乎是固定的，是java程序的入口，java虚拟机就从这个main方法开始执行。
```java
// 文件名 HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.print('Hello World');
    }
}
```
## java 交互式工具: jshell
JDK9开始，JDK内置强大的交互式工具：jshell。它是一个REPL（Read-Eval-Print Loop）工具，该工具是一个交互式的命令行界面，可用于执行Java语言的变量声明，语句和表达式，而且可以立即看到执行结果，可以使用此工具测试java api.

## 面向对象
java是纯粹的面向对象的程序设计语言,这主要表现在java完全支持面向对象的三种基本特征: 继承,封装和多态.

java语言完全以对象为中心,java程序的最小程序单位是类,整个java程序由一个一个的类组成.

面向对象由OOA(面向对象分析),OOD(面向对象设计)和OOP(面向对象编程)三部分组成.OOA和OOD的结构需要使用一种方式来描述并记录,目前业界统一使用UML(统一建模语言)来描述并记录OOA和OOD的结果.

常用的UML图形有用例图,类图,组件图,部署图, 顺序图,活动图和状态图.

### 封装
封装是将对象实现的细节隐藏,通过api来暴露该对象的功能.
### 继承
继承是实现复用的重要方式.子类继承父类,能直接获得父类的属性和方法.
### 多态
多态指的是 子类对象可以直接赋值给父类变量,但运行时依然表现出子类的行为特征,这意味着同一个类型的对象在执行同一个方法时,可能表现出多种行为特征.
抽象也是面向对象的重要部分，抽象就是忽略一个主题中与当前目标无关的那些方面，以便更充分地注意与当前目标有关的方面。抽象并不打算了解全部问题，而只是考虑部分问题.

```java
// 类的声明 关键字class
class Animal {

}
// 类的继承 关键字extends
class Dog extends Animal {

}
// 创建类的实例
Dog jake = new Dog();
```
## 基本语法

### 数据类型
java 数据类型分为基本数据类型和引用数据类型。
基本数据类型分为数值类型和布尔类型。
数值类型分为整数类型，浮点数类型，字符类型。
整数类型分别有：byte， short，int， long(分别占1，2，4，8字节)
浮点数类型分别有：float，double(分别占4，8字节)
字符类型有：char(占2字节)

字符串是引用数据类型。字符串使用双引号，字符类型数据使用单引号。
null是引用类型的一个特殊值。

### 二进制概念
计算机中保存数据都是以二进制的形式保存。任意字符都是通过二进制编码来表示。
数字在计算机底层也都是以二进制形式存在。并且计算机以补码的形式保存所有的整数。
1. 原码
原码是直接将一个数字转换成二进制数。正数在最高位用0表示，负数在最高位用1表示。
2. 反码
反码是除符号位，全部按位取反。
3. 补码
正数的补码和原码相同，负数的补码为原码的反码加1.由负数的补码求原码，也是取反加1.

### 浮点型数据
java浮点数遵循IEEE 754标准，采用二进制数据的科学计数法表示浮点数。
对于float类型，占4字节，32位，第一位是符号位，接下来8位为指数，后23位表示尾数。
对于double类型，占8字节，64位，第一位是符号位，接下来11位为指数，后52位表示尾数。

```java
double a = 5.12e2D; // double类型浮点数
float b = 5.12e2F; // float类型浮点数
```

### 自动类型转换
把某种基本类型的值直接赋值给另一个基本类型的变量，称之为自动类型转换。
规则：表数范围小的可以向表数范围大的转换。
byte->short->int->long->float->double
char->int->long->float-double

### 强制类型转换
手动将某类型的值转换成另一种类型。
注意：强制转换是将大范围的数转手动换为小范围的数，有可能溢出。
```java
int value = 233;
byte bValue = (byte) value; // 将int型转换成byte型，发生溢出，结果为-23。
```
字符串转换成基本类型，需要使用基本类型对应的包装类。可以实现把字符串转换成基本类型。
java为8中基本类型提供了对应的包装类:
都提供了parseXxx(String str) 静态方法用于将字符串转换成基本类型。
1. boolean 对应 Boolean
2. byte 对应 Byte
3. short 对应 Short
4. int 对应 Integer
5. long 对应 Long
6. char 对应 Character
7. float 对应 Float
8. double 对应 Double
```java
String a = '45';
int value = Integer.parseInt(a);
```
### 表达式类型的自动提升
一个算术表达式内包含多个基本类型的值，整个算术表达式的数据类型将发生自动提升。
规则：
1. byte，short，char将被提升为int类型。
2. 整个算术表达式的数据类型自动提升到表达式中最高等级操作数的类型。

### 数组类型
java 语言的数组要求所有的数组元素的数据类型相同。即一个数组中只能存储一种数据类型的数据。

```java
// 定义数组方式
// 声明数组
int[] intArr;
// 静态初始化，只指定数组元素的初始值，不指定数组的长度。
intArr = new int[] {5,6,8,10};
// 定义一个Object数组类型的变量
// String类型是Object的子类。
Object[] objArr;
objArr = new Object[] {"JAVA", "coke"};
// 静态初始化的简化写法
int intArr = {1,2,3,4};

// 动态初始化,指定数组大小,系统自动为数组元素分配初始值。
int[] price = new int[5];
// 初始化数组时元素类型是定义数组时元素类型的子类
Object[] books = new String[4];
```
foreach循环遍历数组

```java
String[] books = {"Java", "C++"};
for (String book: books) {
    System.out.print(book);
}
```
### 类和对象
类的修饰符：public, final, abstract
类定义包含：构造器，成员变量，方法。

构造器是类创建对象的根本途径。java中如果一个类没有写构造器函数，会默认生成一个构造器函数。通过new关键字调用构造器，返回该类的实例。

成员变量的修饰符：public, protected, private, static, final.
public,protected,private只能出现其中之一，可与static，final组合修饰成员变量。

方法的修饰符：public, protected, private, static, final.
public,protected,private只能出现其中之一，abstract和final只可以出现其中之一，可与static组合修饰成员方法。



static修饰的成员表明它属于这个类本身，因为通常把static修饰的成员变量和方法也称为类变量、类方法。

不使用static修饰的普通方法、成员变量则属于该类的单个实例，而不属于该类。

有时也把static修饰的成员变量和方法称为静态变量和静态方法，把不使用static修饰的成员变
量和方法称为非静态变量和非静态方法。静态成员不能直接访问非静态成员。即static修饰的成员不能访问没有static修饰的成员。

类不能访问实例的属性和方法。但是实例可以访问类定义的属性和方法。

this关键字总是指向调用该方法的实例对象。static修饰的方法中不能使用this引用，这个关键字无法指向合适的对象。
```java
// 声明Person类
public class Person {
    // 定义构造器函数,名字必须和类名相同，构造器不需要返回值，实际隐式返回了类的实例对象。
    // 构造器可以用public，protected，private修饰
    public Person() {
        this.age = 18; // 所有实例对象的age变量都是18
    }
    // 定义实例属性和方法
    public String name;
    public int age;
    public void say(String content) {
        Syetem.out.print('content')
    }
    // 程序执行的入口
    public static void main(String[] args) {
        System.out.print('')
    }
}

// 定义Person类的实例对象
Person jake = new Person();
```
### 方法
#### 参数传递机制
按值传递
#### 实现重载

### 访问控制符
java提供了3个访问控制符：private，protected，public，分别代表不同级别的访问控制级别。还有一个没有访问控制符的级别default。一共4个级别。当不使用任何访问控制符来修饰类或类成员的时候，系统默认使用该访问控制级别。
四个访问控制级别：
* private：只允许在当前类的内部被访问，用于修饰成员变量最合适（当前类访问权限）。
* default：不使用任何访问控制符修饰时的访问级别（包访问权限）。
* protected：可以被同一个包中的其他类访问，也可以被不同包中的子类访问。使用protected修饰方法，通常是希望其子类重写这个方法。（子类访问权限）。
* public：可以被所有类访问。（公共访问权限）。
### 包（package）
java 引入包机制，提供了类的多层命名空间，用于解决类的命名冲突，类文件管理等问题。

java允许将一组功能相关的类放在同一个package下，组成逻辑上的类库单元。

package语句必须作为源文件的第一条非注释性语句，一个源文件只能指定一个包，即只能包含一条package语句，该源文件中可以定义多个类，则这些类将全部位于该包下。

同时位于包中的类，在文件系统中也必须有与包名层次相同的目录结构。

java包机制需要两个方面保证：
1. 源文件里使用package语句指定包名
2. class文件必须放在对应的路径下。
```java
package lee;
public class Hello {

}
// 创建其他包下类的实例，在调用构造器时，需要使用包前缀
var a = new lee.Hello();

// 使用import关键字导入指定类, 之后可以省略包名
import lee.Hello;
// 使用import关键字导入全部类
import lee.*;
// 使用import static 静态导入（静态成员变量，方法）,之后可以省略类名
import static packageName.ClassName;
// 使用import static 静态导入 全部静态成员变量，方法
import static packageName.ClassName.*
```
#### 常用的包
java的核心类都放在java包及其子包下，java扩展的许多类放在javax包及其子包下。
1. java.lang 包含java语言的核心类，如String，Math， System，和Thread类等。
使用这个包下的类无须使用import语句导入，系统会自动导入这个包下的所有类。
2. java.util 包含了java的大量工具类/接口和集合框架类/接口。例如Array和List，Set等。
3. java.net 包含了java网络编程的相关的类/接口。
4. java.io 包含了java输入/输出编程相关的类/接口。
5. jvav.text 包含了java格式化的类。
6. java.sql 包含了java进行JDBC数据库编程的相关类/接口。
7. java.awt 包含了抽象窗口工具集（Abstract Window Toolkits）的相关类/接口，这些类用于构建图形用户界面（GUI）程序。
8. java.swing 包含了Swing图形用户界面编程的相关类/接口，用于构建平台无关的GUI程序。

### 深入理解构造器
构造器是一个无返回值的函数，用于创建实例时执行初始化。系统默认将对象的实例变量进行初始化，将数值型设为0，将布尔型设为false，将引用类型设为null。

通过使用构造器，显式地指定实例变量的初始值。
如果没有提供构造器，系统会提供一个默认的构造器，java类至少包含一个构造器。
```java
public class ConstructorTest {
    public String name;
    public int count;
    public ConstructorTest(String name, int count) {
        this.name = name;
        this.count = count;
    }

    public static void main(String[] args) {
        ConstructorTest jake = new ConstructorTest('jake', 15);
        System.out.println(jake.name);
        System.out.println(jake.count);
    }
}
```
同一个类中有多个构造器，称为构造器重载.
```java
public class ConstructorOverload {
    public String name;
    public int count;
    // 提供无参数的构造器
    public ConstructorOverload() {

    }
    // 提供有参数的构造器
    public ConstructorTest(String name, int count) {
        this.name = name;
        this.count = count;
    }
}
```

### 继承
继承写法如下,继承实现的子类不能获得父类的构造器和初始化块.
java是单继承,不是多继承不能同时继承多个父类.

重写的规则:方法名相同,形参列表相同,子类方法返回值类型小于等于父类方法返回值类型,子类方法声明抛出的异常类小于等于父类方法声明抛出的异常类.子类方法的访问权限要比父类方法的权限更大,或相等.

重写的方法必须和原父类的方法一致,都是类方法,或者实例方法.

super是Java提供的一个关键字，super用于限定该对象调用它从父类继承得到的实例变量或方法。正如this不能出现在static修饰的方法中一样，super也不能出现在static修饰的方法中。
```java
public class Bird {
 public void fly() {

 }
}
public class Ostrich extends Bird {
    // 重写父类的方法
    public void fly() {

    }
    // 调用父类中被重写方法
    public void callOverrideMethod() {
        super.fly();
    }
}
```
### 多态