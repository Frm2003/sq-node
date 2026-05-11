import SchemaStorage from '../core/SchemaStorage.js';
import DataStorage from '../core/DataStorage.js';

export default class CreateTable {

    static execute(tableName, schema) {
        SchemaStorage.createTable(tableName, schema);
        DataStorage.createTable(tableName);
    }
}