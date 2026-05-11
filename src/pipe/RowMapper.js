export default class RowMapper {

    static extractRowsFromArray(tableName, schema, jsonList) {
        const rows = {};
        rows[tableName] = [];

        for (const json of jsonList) {
            this.#processObject({ tableName, schema, json, rows, parentId: null, parentTable: null });
        }

        return rows;
    }

    static #processObject({ tableName, schema, json, rows, parentId, parentTable }) {

        const table = schema.tables[tableName];
        if (!table) return;

        rows[tableName] ??= [];

        const row = {};

        // FK do pai
        if (parentId !== null && parentTable) {
            row[`${parentTable}_id`] = parentId;
        }

        // copia colunas primitivas
        for (const [key, value] of Object.entries(json)) {

            if (Array.isArray(value)) continue;

            if (value && typeof value === "object") continue;

            if (table.columns[key]) {
                row[key] = value;
            }
        }

        rows[tableName].push(row);

        const currentId = row.id;

        for (const [key, value] of Object.entries(json)) {

            // ARRAY
            if (Array.isArray(value)) {
                const childTableName = `${tableName}_${key}`;

                rows[childTableName] ??= [];

                for (const item of value) {
                    // array de objetos
                    if (item && typeof item === "object") {
                        this.#processObject({ tableName: childTableName, schema, json: item, rows, parentId: currentId, parentTable: tableName });
                        continue;
                    }

                    // array primitivo
                    rows[childTableName].push({
                        [`${tableName}_id`]: currentId,
                        [key]: item
                    });
                }

                continue;
            }

            // OBJETO
            if (value && typeof value === "object") {
                const childTableName = `${tableName}_${key}`;
                this.#processObject({ tableName: childTableName, schema, json: value, rows, parentId: currentId, parentTable: tableName });
            }
        }
    }
}