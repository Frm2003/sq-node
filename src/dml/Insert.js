import DataStorage from "../core/DataStorage";
import SchemaStorage from "../core/SchemaStorage";

export default class Insert {

    static into(tableName, rows) {
        return {
            values: (data) => {
                if (!SchemaStorage.hasTable(tableName)) {
                    throw new Error(`Tabela '${tableName}' não existe`);
                }

                const rows = this.#normalize(data);

                DataStorage.insert(tableName, rows);
            }
        };
    }

    static #normalize(data) {
        if (!Array.isArray(data)) {
            return [data];
        }

        return data;
    }
}