export default class WhereEvaluator {
    static #operators = {
        '==': (a, b) => a === b,
        '!=': (a, b) => a !== b,
        '>': (a, b) => a > b,
        '<': (a, b) => a < b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
    };

    static apply(rows, predicateTree) {
        if (!predicateTree) return rows;

        return rows.filter(row =>
            this.#evaluateNode(row, predicateTree)
        );
    }

    static #evaluateNode(row, node) {
        switch (node.type) {
            case 'AND':
                return (this.#evaluateNode(row, node.left) && this.#evaluateNode(row, node.right));

            case 'OR':
                return (this.#evaluateNode(row, node.left) || this.#evaluateNode(row, node.right));

            case 'CONDITION':
                return this.#evaluateCondition(row, node);

            default:
                throw new Error(`Tipo inválido: ${node.type}`);
        }
    }

    static #evaluateCondition(row, condition) {
        const operatorFn = this.#operators[condition.operation];

        if (!operatorFn)
            throw new Error(`Operação inválida: ${condition.operation}`);

        const { table, column } = condition.field;

        return operatorFn(row[table][column], condition.value);
    }
}