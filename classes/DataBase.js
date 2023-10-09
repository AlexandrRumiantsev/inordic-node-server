const mysql = require("mysql")
const uid = require('uuid');

module.exports = class DataBase {
    //Приватный атрибут-конфигурация для подключения к БД
    #config = {
        host: "94.228.126.172",
        port: 3306,
        user: "inordic_sch_usr",
        password: "VANCfzNsov9GDt1M",
        database: "inordic_school",
        connectionLimit : 1000,
        connectTimeout  : 60 * 60 * 1000,
        acquireTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000
    }
    //Название таблицы к которой мы обращаемся, пока пустое абстрактное название
    #table_name 
    //Определим приватный стату заранее
    #status_text

    //Метод, который устанавливает приватный атрибут table_name
    setTableName(tableName){
        this.#table_name = tableName;
    }

    //Метод, который устанавливает приватный атрибут STATUS_TEXT
    setStatus(statusText){
        //Устанавливаем в приватный атрибут переданное значение
        this.#status_text = statusText;
    }

    //Метод, который устанавливает соединение с БД 
    getConnect(){
        //Создаем соединение с базой данных
        const connect = mysql.createPool(this.#config)
        //Вернем установленное соединение
        return connect
    }
    getAll(res){
        //Обратимся к файлу конигурации и передадим его параметров в функцию подключения к базе данных
        //Функция для отправки запроса в базу данных
        this.getConnect().query(
            `SELECT * FROM ${this.#table_name}`,
            function (error, result) {
                res.send(result)
            }
        )
    }

    getItem(res, id){
        this.getConnect().query(
            `SELECT * FROM ${this.#table_name} WHERE ID="${id}"`,
            function (error, result) {
                res.send(result)
            }
        )
    }

    delItem(res, id){
        this.getConnect().query(
            `DELETE FROM ${this.#table_name} WHERE ID="${id}"`,
            function (error, result) {
                res.send(result)
            }
        )
    }

    addItem(response, data){
        //Сгенерируем ID для добавления товара
        //console.log(uid);
        console.log(data);
        const id = uid.v4();
        //Добавляю в объект данный с формы, сгенерированныи идентификатор
        data['ID'] = id
        console.log(id);
        //Составить запрос к БД
        //Переберем поля передаваемые с формы в цикле
        //Создадим переменные, части строки запроса 
        let fieldsName = '(';
        let valueFields = '(';
        let key = 0;
        for(let field in data){
            console.log(field)
            //Формируем в цикле, строку с названием полей в базе данных
            fieldsName += field;
            //Формируем в цикле, строку с значением полей
            valueFields += `'${data[field]}'`;
            //Обновляем ключе на единицу
            console.log(Object.keys(data).length);
            console.log(key);
            if(Object.keys(data).length - 1 === key) {
                fieldsName += ')';
                valueFields += ')';
            } else {
                fieldsName += ', ';
                valueFields += ', ';
            }

            key++
        }
        //console.log(fieldsName)
        //console.log(valueFields)
        const sql = `
            INSERT INTO ${this.#table_name} ${fieldsName}
            VALUES ${valueFields}
        `;
        //Задействуем, созданный нами метод, для обращения к БД
        this.sendSqlToBase(sql, response);
    }

    sendSqlToBase(sqlString, response){
        //Получим соединение с БД и отправляем запрос
        const connect = this.getConnect(); 
        //Отправим запрос
        const status = this.#status_text
        connect.query(sqlString, function(error, result){
            //Обрабатываем НЕ успешный запрос к серверу
            if(error) {
                const responseObject = {
                    status: 500,
                    data: error,
                    statusText: status['500'],
                }
                response.send(
                    JSON.stringify(responseObject)
                )
            }
            if(result.affectedRows === 1){
                //Отправим ответ в JSON формате с информацией о товаре и статусом
                const responseObject = {
                    status: 200,
                    statusText: status['200'],
                    data: result
                }
                response.send(
                    JSON.stringify(responseObject)
                )
            }
        })
    }
}