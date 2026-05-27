import ParserUtils from '../ParserUtils.js';

export default class ParserWhere {

    static apply(parser) {
        return this.parseOr(parser);
    }

    // OR (menor precedência)
    static parseOr(parser) {
        let left = this.parseAnd(parser);

        while (parser.peek()?.type === 'OR') {
            parser.consume('OR');

            const right = this.parseAnd(parser);

            left = {
                type: 'LOGICAL_EXPRESSION',
                operator: 'OR',
                left,
                right,
            };
        }

        return left;
    }

    // AND (maior precedência que OR)
    static parseAnd(parser) {
        let left = this.parsePrimary(parser);

        while (parser.peek()?.type === 'AND') {
            parser.consume('AND');

            const right = this.parsePrimary(parser);

            left = {
                type: 'LOGICAL_EXPRESSION',
                operator: 'AND',
                left,
                right,
            };
        }

        return left;
    }

    // PRIMARY (onde entram parênteses ou comparação)
    static parsePrimary(parser) {

        // ( expr )
        if (parser.peek()?.type === 'LPAREN') {
            parser.consume('LPAREN');

            const expr = this.parseOr(parser);

            parser.consume('RPAREN');

            return expr;
        }

        return this.parseComparison(parser);
    }

    // comparação simples
    static parseComparison(parser) {
        const left = ParserUtils.parseColumn(parser);

        const operation = parser.consume('OP');

        let right = parser.peek()?.type == 'IDENT'
            ? ParserUtils.parseColumn(parser) 
            : {
                value: ParserUtils.parseValue(parser.consume('NUMBER', 'STRING', 'BOOLEAN')),
            }

        return {
            type: 'COMPARISON_EXPRESSION',
            operator: operation.value,
            left,
            right,
        };
    }
}