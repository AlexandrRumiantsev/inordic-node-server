const mysql = require("mysql")

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

    setTableName(tableName){
        this.#table_name = tableName;
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
}