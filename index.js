// подключение express с помощью require
const express = require("express");
// Аналог с импортом, которого нет в node 
// import express from 'express' 
// Запускаем express
// express, это метод, результат работы которого мы перемещаем в переменную app
const app = express();  

// Импорт моделей клссов
const Good = require("./classes/Good");
const User = require("./classes/User");

// Получаем плагн bodyParser в переменную
const bodyParser = require('body-parser');

//задействуем bodyParser в нашем приложении
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/**
 * Корневой маршрут в приложении
 */
app.get("/", function(request, response){
    response.send(`
        <h1>
            Корневой маршрут
        </h1>
        <a href='/good/get'>Получение всех товаров: /good/get</a>
        <a href='/good/get/1'>Получения одного товара: /good/get/[id]</a>
    `);
})

/**
 * Маршрут для получения товаров из интернет магазина
 * Пример использования: http://localhost:3000/good/get
 */
app.get('/good/get', function(request, response){
    //Создаем на основе класса объект
    const good = new Good();
    //Задействуем метод, который описан внутри класса
    good.getAll(response)
})

/**
 * Маршрут для получения одного товара из интернет магазина
 * Динамический маршрут
 * Пример использования: http://localhost:3000/good/get/:id
 */
app.get('/good/get/:id', function(request, response){
    //Создаем на основе класса объект
    const good = new Good();
    //Получить идентификатор из адресной строки
    const id = request.params.id
    //Задействуем метод, который описан внутри класса
    good.getItem(response, id)
})

/**
 * Маршрут для удаления одного товара из интернет магазина
 * Динамический маршрут
 * Пример использования: http://localhost:3000/good/del/:id
 */
app.get('/good/del/:id', function(request, response){
    //Создаем на основе класса объект
    const good = new Good();
    //Получить идентификатор из адресной строки
    const id = request.params.id
    //Задействуем метод, который описан внутри класса
    good.delItem(response, id)
})

/**
 * Маршрут для получения всех пользователей
 * Пример использования: http://localhost:3000/user/get
 */
app.get(
    '/user/get',
    function(request, response){
        //Создаем объект на основе класса User
        const user = new User();
        //Передаем в метод для получения данных 
        //о всех пользователях
        //Ответ от сервера (response)
        user.getAll(response)
    }
)

/**
 * Маршрут для получения одного пользователя пользователей
 * Пример использования: http://localhost:3000/user/get/:id
 */


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