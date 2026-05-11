export default class Projection {
    static project(rows, fields) {
        const output = {};

        for (const field of fields) {
            output[field] = [];
        }

        for (const row of rows) {
            for (const field of fields) {
                output[field].push(row[field]);
            }
        }

        return output;
    }
}