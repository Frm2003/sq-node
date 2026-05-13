export default class SchemaBuilder {

    static handleArray(tableName, jsonList, schema = { tables: {} }) {
        if (!schema.tables[tableName]) {
            schema.tables[tableName] = { columns: {} };
        }

        // GARANTE PK
        if (!schema.tables[tableName].columns.id) {
            schema.tables[tableName].columns.id = "pk";
        }


        for (const json of jsonList) {
            for (const [key, value] of Object.entries(json)) {
                if (Array.isArray(value)) {
                    schema.tables[key] = schema.tables[key] || { columns: {} };
                    schema.tables[key].columns[`${tableName}_id`] = "fk";

                    const first = value[0];

                    if (first && typeof first === "object") {
                        this.handleArray(key, value, schema);
                        continue;
                    }

                    schema.tables[key].columns[key] = typeof first;

                    continue;
                }

                if (value && typeof value === "object") {
                    schema.tables[key] = schema.tables[key] || { columns: {} };
                    schema.tables[key].columns[`${tableName}_id`] = "fk";

                    this.handleArray(key, [value], schema);
                    continue;
                }

                schema.tables[tableName].columns[key] = typeof value;
            }
        }

        return schema;
    }
}