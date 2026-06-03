import ParserUtils from '../ParserUtils.js';

export default class ParserWhere {
    static #PRECEDENCE = new Map([
        ['||', 1],
        ['&&', 2],
    ]);

    static match(parser) {
        if (parser.match('WHERE'))
            return this.apply(parser);

        return null;
    }

    static apply(parser) {
        parser.consume('WHERE');
        return this.#parseLogicalExpression(parser)
    }

    static #parsePrimary(parser) {
        if (parser.peek()?.type === 'LPAREN') {
            parser.consume('LPAREN');

            const expr = this.#parseLogicalExpression(parser);

            parser.consume('RPAREN');

            return expr;
        }

        return this.#parserExpression(parser);
    }

    static #parseLogicalExpression(parser, minPrecedence = 0) {
        let left = this.#parsePrimary(parser);

        while (true) {
            const next = parser.peek();

            if (!next || next.type !== 'OP') break;

            const precedence = this.#PRECEDENCE.get(next.value);

            if (precedence === undefined || precedence < minPrecedence) break;

            const operation = parser.consume('OP');

            const right = this.#parseLogicalExpression(parser, precedence + 1);

            left = {
                type: 'LOGICAL_EXPRESSION',
                operation: operation.value,
                left,
                right,
            };
        }

        return left;
    }

    static #parserExpression(parser) {
        const left = ParserUtils.parseColumn(parser);

        const operation = parser.consume('OP').value;

        const right = ParserUtils.parseValue(parser.consume('NUMBER', 'STRING', 'BOOLEAN'))

        return {
            type: 'COMPARISON_EXPRESSION',
            operation,
            left,
            right
        };
    }
}