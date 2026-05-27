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
        if (!predicateTree)
            return rows;

        return rows.filter(row => this.#evaluateNode(row, predicateTree));
    }

    static #evaluateNode(row, node) {
        switch (node.type) {

            case 'LOGICAL_EXPRESSION': {
                const left = this.#evaluateNode(row, node.left);
                const right = this.#evaluateNode(row, node.right);

                if (node.operator === 'AND') return left && right;
                if (node.operator === 'OR') return left || right;

                throw new Error(`Operador lógico inválido: ${node.operator}`);
            }

            case 'COMPARISON_EXPRESSION':
                return this.#evaluateComparison(row, node);

            default:
                throw new Error(`Tipo inválido: ${node.type}`);
        }
    }

    static #evaluateComparison(row, node) {
        const operatorFn = this.#operators[node.operator];

        if (!operatorFn)
            throw new Error(`Operação inválida: ${node.operator}`);

        const left = this.#resolveValue(row, node.left);
        const right = this.#resolveValue(row, node.right);

        return operatorFn(left, right);
    }

    static #resolveValue(row, operand) {
        // caso seja coluna
        if (operand.table && operand.column) {
            const { table, column } = operand;
            return row?.[table]?.[column] ?? row?.[column];
        }

        // caso seja literal
        if ('value' in operand) {
            return operand.value;
        }

        throw new Error('Operand inválido');
    }
}