const mysql = require("mysql")
/**
 * Класс для работы с пользователями из базы данных
 * getAll - метод для получения всех пользователей
 */
module.exports = class User {
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

    getAll(res){
        //Создаем соединение с базой данных
        const connect = mysql.createPool(this.#config)
        //Отправим запрос к базе данных 
        connect.query(
            'SELECT * FROM users',
            //Функция обратного вызова
            function(error, result){
                //Передаем результат запроса в функцию send
                res.send(
                    result
                )
            }
        )
    }

}