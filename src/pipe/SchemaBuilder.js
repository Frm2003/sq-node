export default class SchemaBuilder {

    static handleArray(tableName, jsonList, schema = { tables: {} }) {
        if (!schema.tables[tableName]) {
            schema.tables[tableName] = { columns: {} };
        }

        for (const json of jsonList) {
            for (const [key, value] of Object.entries(json)) {

                if (Array.isArray(value)) {

                    const tableNameChild = `${tableName}_${key}`;

                    schema.tables[tableNameChild] = schema.tables[tableNameChild] || { columns: {} };
                    schema.tables[tableNameChild].columns[`${tableName}_id`] = "fk";

                    const first = value[0];

                    if (first && typeof first === "object") {
                        this.handleArray(tableNameChild, value, schema);
                        continue;
                    }

                    schema.tables[tableNameChild].columns[key] = typeof first;

                    continue;
                }

                if (value && typeof value === "object") {
                    this.handleArray(`${tableName}_${key}`, [value], schema);
                    continue;
                }

                schema.tables[tableName].columns[key] = typeof value;
            }
        }

        return schema;
    }
}