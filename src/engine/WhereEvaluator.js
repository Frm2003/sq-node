export default class WhereEvaluator {
    static parseExpression(parser) {
        let left = this.#parsePrimary(parser);

        while (true) {
            const operator = parser.accept('AND', 'OR');

            if (!operator)
                break;

            const right = this.#parsePrimary(parser);

            left = {
                type: operator.type,
                left,
                right
            };
        }

        return left;
    }

    static #parsePrimary(parser) {
        // grupo
        if (parser.accept('LPAREN')) {
            const expr = this.parseExpression(parser);

            parser.consume('RPAREN');

            return expr;
        }

        const left = parser.consume('IDENT');

        // shorthand boolean
        if (!parser.peek() || ['AND', 'OR', 'RPAREN'].includes(parser.peek().type)) {
            return {
                type: 'BOOLEAN',
                column: left.value,
                value: true
            };
        }

        const operation = parser.consume('OP');
        const right = parser.consume('NUMBER', 'STRING', 'BOOLEAN', 'NULL');

        return {
            type: 'CONDITION',
            column: left.value,
            operation: operation.value,
            value: this.#parseValue(right)
        };
    }

    static #parseValue(right) {
        if (right.type === 'BOOLEAN')
            return right.value === 'true';

        if (right.type === 'NUMBER')
            return Number(right.value);

        if (right.type === 'STRING')
            return String(right.value);
    }
}