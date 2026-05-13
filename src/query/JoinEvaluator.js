import DataStorage from '../core/DataStorage.js';

export default class JoinEvaluator {
    static #operators = {
        '==': (a, b) => a === b,
        '!=': (a, b) => a !== b,
        '>': (a, b) => a > b,
        '<': (a, b) => a < b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
    };

    static apply(rows, joins = []) {
        let result = rows;

        for (const { table, on } of joins) {
            const { left, operation, right } = on;

            const rightTable = DataStorage.getTable(table);
            const op = this.#operators[operation];

            const joined = [];

            for (const leftRow of result) {

                for (const rightRow of rightTable) {

                    if (!op(leftRow[left.column], rightRow[right.column]))
                        continue;

                    joined.push({
                        [`${left.table}`]: { ...leftRow },
                        [`${right.table}`]: { ...rightRow }
                    });
                }
            }

            result = joined;
        }

        return (result);
    }
}