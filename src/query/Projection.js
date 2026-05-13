export default class Projection {
    static project(rows, fields) {
        const output = {};

        for (const { table, column } of fields) {
            output[table] ??= {};
            output[table][column] ??= [];
        }

        for (const row of rows) {
            for (const { table, column } of fields) {
                const value = row?.[table]?.[column] ?? row?.[column];
                output[table][column].push(value);
            }
        }

        return output;
    }
}