export default class WhereEvaluator {
    static #operators = {
        '==': (a, b) => a === b,
        '!=': (a, b) => a !== b,
        '>': (a, b) => a > b,
        '<': (a, b) => a < b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
    };

    static apply(rows, where = []) {
        if (!where.length)
            return rows;

        return rows.filter(row => this.#matchRow(row, where));
    }

    static #matchRow(row, where) {
        return where.every(condition => {
            const operatorFn = this.#operators[condition.operator];

            if (!operatorFn) {
                throw new Error(`Operação inválida: ${condition.operator}`);
            }

            return operatorFn(
                row[condition.field],
                condition.value
            );
        });
    }
}