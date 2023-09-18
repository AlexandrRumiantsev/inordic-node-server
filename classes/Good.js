const DataBase = require('./DataBase')
/**
 * Класс для работы с товарами из базы данных
 * getAll - метод для получения всех товаров
 */
module.exports = class Good extends DataBase {
    constructor(){
        //ключевое слово супер, говорит нам о том, 
        //что мы забираем из родительского класса его методы и атрибуты
        super();
        //устанавливаем название таблицы
        this.setTableName('goods');
    }
}