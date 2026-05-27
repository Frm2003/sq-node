export default class SchemaStorage {
    static #schemas = new Map();

    static createTable(tableName, schema) {

        if (this.#schemas.has(tableName)) {
            throw new Error(
                `Tabela '${tableName}' já existe`
            );
        }

        this.#schemas.set(tableName, schema);
    }

    static getTable(tableName) {
        return this.#schemas.get(tableName);
    }

    static hasTable(tableName) {
        return this.#schemas.has(tableName);
    }
}