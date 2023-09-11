// подключение express с помощью require
const express = require("express");
// Аналог с импортом, которого нет в node 
// import express from 'express' 
// Запускаем express
// express, это метод, результат работы которого мы перемещаем в переменную app
const app = express();  
// Получаем плагн bodyParser в переменную
const bodyParser = require('body-parser');
const { extend } = require("@vue/shared");

//задействуем bodyParser в нашем приложении
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

class Test{

    atribute1 = 'Первый атрибут'
    atribute2 = 'Второй атрибут'
    atribute3 = 'Третий атрибут'
    name 
    family

    method1(param1){
        console.log('Первый метод: ', param1)
    }
    method2(param2){
        console.log('Второй метод: ', param2)
    }
    method3(){
        console.log('Третий метод: ', this.name, this.family)
    }
    constructor(param1, param2){
        //console.log('ПОявился новый объект Test')
        //console.log('Первый параметр', param1)
        //console.log('Второй параметр', param2)
        this.name = param1
        this.family = param2

        this.method1(param1);
        this.method2(param2);
        this.method3()
    }
}

//Используем класс
const obj1 = new Test('Михаил', 'Петрович')
console.log('Объект 1: ', obj1.name, obj1.family)
obj1.method3();
const obj2 = new Test('Иван', 'Иванов')
console.log('Объект 2: ', obj2.name, obj2.family)
obj2.method3();

// ООП - Объектно ориентированное программирование

// Три кита ООП (Основные) 

// Наследование (Пример)
class ChildrenTom{
    name = 'Томас qwerty'
    family = 'Мартин'
    #region = 'Северный регион'
    voice() {
        console.log('Привет')
    }
}

class ChildrenAlex extends ChildrenTom{

}

const tom = new ChildrenTom();
const alex = new ChildrenAlex();

console.log('Имя первого ребенка: ',tom.name)
console.log('Имя второго ребенка: ',alex.family)

tom.voice()
alex.voice()



// Инкапсуляция

//нельзя обратится ВНЕ класса
//tom.#region

class David{
    //Приватный уровень доступа атрибута
    #name = 'Дэвид'
    //Защищенный уровень доступа
    _family = 'Джонас'

    #test(){
        console.log('Приватный метод');
    }
    getName(){
        return this.#name;
    }
    setName(name){
        this.#name = name
    }
    constructor(){
        console.log('Меня зовут: ', this.#name)
        this.#test()
    }
}
const david = new David();
console.log(david.getName())
//david.#name = 'Питер'
david.setName('Новое имя')
console.log(david.getName())
//Нельзя обратится к приватному методу из вне
//console.log(david.#test())

// Полиморфизм
class Animal {
    getVoice(){
        if(this.type == 'cat') {
            console.log('Мяу - мяю')
        }
        if(this.type == 'dog') {
            console.log('Гав - гав')
        }
    }
}

class Dog extends Animal{
    type = 'dog'
}

class Cat extends Animal{
    type = 'cat'
}

// Создаем 2 объекта
const cat = new Cat()
const dog = new Dog()
// Задействуем общий метод
cat.getVoice();
dog.getVoice();

// Абстракция
class Parent {
    getName() {}
} 

class Child1 extends Parent {
    //Реализация 1
    getName(){
        console.log('Меня зовут Иван')
    }
} 

class Child2 extends Parent {
    //Реализаия 2
    getName(){
        console.log('Меня зовут Петр')
    }
}

const child1 = new Child1() 
const child2 = new Child2() 

child1.getName();
child2.getName();

//Смешенные приемы
class T0 {
    //ПОЛУАбстрактный getAction
    getAction(){
        console.log(
            `Я умею ${this.action}`
        )
    }
}


new T0().getAction();

class T1 extends T0{
   action = 'Бегать'
}

class T2 extends T0{
   action = 'Прыгать'
}

new T1().getAction()
new T2().getAction()

/**
 * Корневой маршрут в приложении
 */
app.get("/", function(request, response){
    response.send("<h2>Привет Express!</h2>");
})

app.get('/test', function(request, response){
    response.send("<h2>Тестовый URL</h2>");
})

app.get('/test2', function(request, response){
    response.send("<h2>Тестовый URL 2</h2>");
})

app.post('/getdata', function(request, response){
    console.log(request.body.test)
    response.send(`<h2>Получение данных ${request.body.test}, ${request.body.inordic}</h2>`);
})

app.get('/senddata', function(request, response){
    response.send(
        `
        <h2>Отправка данных</h2>
        <form action='/getdata' method='POST'>
            <input type='text' name='test'>
            <input type='text' name='inordic'>
            <input type='submit' value='Отправить'>
        </form> 
        `
    );
})

app.get('/hello', function(request, response){
    console.log(request);
    response.send(
        `test = ${request.query.test}, inordic = ${request.query.inordic}`
    )
})
// Запускаем все, что было написано выше, на 3000 порте
app.listen(3000);