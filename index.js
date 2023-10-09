// подключение express с помощью require
const express = require("express");
// Аналог с импортом, которого нет в node 
// import express from 'express' 
// Запускаем express
// express, это метод, результат работы которого мы перемещаем в переменную app
const app = express();  
//Подключим плаги multer
const multer = require('multer')
//Настроим multer, 1 этап - указываем в какую папку будет происходить сохранение файла
const uploadFromForm = multer({dest: 'uploads/'})
//Настроим multer, 2 этап - Укажем элемент, из которого элемента будет приходить файл
const fileFromForm = uploadFromForm.single('INORDICFILE');
//импортируем плагин для работы с айловой системой
const fs = require("fs");



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
        <ul>
            <li>
                <a href='/good/get'>
                    Получение всех товаров: /good/get
                </a>
            </li>
            <li>
                <a href='/good/get/1'>
                    Получения одного товара: /good/get/[id]
                </a>
            </li>
        </ul>
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
 * ДЗ 
 * Маршрут для получения одного пользователя пользователей
 * Пример использования: http://localhost:3000/user/get/:id
 */
app.get(
    '/user/get/:id',
    function(request, response){
        //Создаем на основе класса объект
        const user = new User();
        //Получить идентификатор из адресной строки
        const id = request.params.id
        //Задействуем метод, который описан внутри класса
        user.getItem(response, id)
    }
)

/**
 * Маршрут для добавления одного товара
 * Пример использования http://localhost:3000/good/add
 * Тип маршрута Post
 * data: {TITLE, DISCR, PRICE, IMG, COUNT}
 */
app.post(
    '/good/add',
    function(request, response){
        //Данные из запроса
        console.log(request.body)
        const good = new Good();
        good.addItem(response, request.body)
    }
)

/**
 * Маршрут для обновления товара
 * Пример - http://localhost:3000/good/update/
 * type - POST
 */

app.post(
    '/good/update',
    function(request, response){
        console.log(request.body)
        const good = new Good()
        good.updateItem(response, request.body)
    }
)

/**
 * Маршрут для удаления файла
 * Пример http://localhost:3000/file/del/:name
 * type - GET
 */
app.get(
    '/file/del/:name',
    function(request, response){
        const fileName = request.params.name
        // Передавая фукнции unlink, полный путь до файл, мы задействуем его удаление
        fs.unlink(`./uploads/${fileName}`, function(error){
            //Объект для формирования ответа от сервера
            const responseObject = {}

            if (error) {
                responseObject.status = 500;
                responseObject.message = 'Файл не удалился'
                response.send(JSON.stringify(responseObject))
            }

            responseObject.status = 200;
            responseObject.message = 'Файл удалился'
            response.send(JSON.stringify(responseObject))
        })
    }
)


/**
 * Маршрут для зписи файла в папку на Сервере
 * Пример http://localhost:3000/file/add
 */

app.post(
    '/file/add', 
    fileFromForm,
    function(request, response){
       console.log(request.file)
       //Путь к файлу (откуда мы его забираем)
       const filePath = request.file.path;
       //Формируем путь, куда хотим сохранить файл
       const pathToSave = `uploads/${request.file.originalname}`;
       //Прочитаем временный файл
       const pathForReadFile = fs.createReadStream(filePath);
       //Записать постоянный файл
       const desc = fs.createWriteStream(pathToSave)
       //Закончить запись файла
       pathForReadFile.pipe(desc);
       //Объект для формирования ответа от сервера
       const responseObject = {}
       //Перехватим событие после удачной записи файла
       pathForReadFile.on('end', function(){
        responseObject.status = 200
        responseObject.message = 'файл успешно записан'
        response.send(JSON.stringify(responseObject))
       })

       //Перехватим событие после НЕ удачной записи файла
       pathForReadFile.on('error', function(){
        responseObject.status = 500
        responseObject.message = 'файл не записан'
        response.send(JSON.stringify(responseObject))
       })

    }
)


//Вспомогательные формы
app.get(
    '/file/form/add', 
    function(request, response){
       response.send(`
            <h1>Форма для загрузки файла</h1>
            <form action='/file/add' method='POST' enctype='multipart/form-data'>
                <input type='file' name="INORDICFILE"/>
                <input type='submit' />
            </form>
       `) 
    }
)

app.get(
    '/good/form/update/:id',
    function(request, response){
        const id = request.params.id
        response.send(
            ` <h1>Редактируем товара: ${id}</h1>
            <form action='/good/update' method='POST'>
                <input type='hidden' name='ID' value='${id}' />
                <input name='TITLE' placeholder='Название товара' />
                <input name='DISCR' placeholder='Описание товара' />
                <input name='PRICE' placeholder='Цена товара' type='number' />
                <input name='IMG' placeholder='Изобрважение товара' />
                <input name='COUNT' placeholder='Количество товара' type='number' />
                <input type='submit' value='Обновить товар'  />
            </form>
            `
        )

    }
)

/**
 * Вспомогательный маршрут для добавления товара
 * Содержит форму для добавления товара
 * Тип маршрута Get
*/
app.get(
    '/good/form/add',
    function(request, response){
        response.send(`
            <form method='POST' action='/good/add'>
                <input name='TITLE' placeholder='Название товара'/>
                <input name='DISCR' placeholder='Описание товара'/>
                <input name='PRICE' type='number' placeholder='Цена товара'/>
                <input name='IMG' placeholder='Изображение товара'/>
                <input name='COUNT' type='number' placeholder='Количество товара'/>
                <input type='submit' value='Добавить товар'>
            </form> 
        `)
    }
)

// Запускаем все, что было написано выше, на 3000 порте
app.listen(3000);