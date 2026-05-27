export default class DataStorage {
    static #tables = new Map();

    static createTable(tableName) {
        if (this.#tables.has(tableName)) {
            throw new Error(`Tabela '${tableName}' já existe`);
        }

        this.#tables.set(tableName, []);
    }

    static hasTable(tableName) {
        return this.#tables.has(tableName);
    }

    static getTable(tableName) {
        if (!this.#tables.has(tableName)) {
            throw new Error(`Tabela '${tableName}' não existe`);
        }

        return this.#tables.get(tableName);
    }

    static getTables() {
        return this.#tables;
    }

    static insert(tableName, rows) {
        const table = this.getTable(tableName);
        table.push(...rows);
    }

    static insertMany(rowsMap) {
        for (const [tableName, rows] of Object.entries(rowsMap)) {
            this.insert(tableName, rows);
        }
    }
}