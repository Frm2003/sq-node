export default class ParserWhere {
    static PRECEDENCE = {
        OR: 1,
        AND: 2,

        EQ: 3,
        NEQ: 3,
        GT: 3,
        GTE: 3,
        LT: 3,
        LTE: 3,

        PLUS: 4,
        MINUS: 4,

        STAR: 5,
        SLASH: 5,
    }

    static #prefixParsers = {
        LPAREN: (parser) => {
            parser.consume('LPAREN');

            const expression = ParserWhere.#parseExpression(parser);

            parser.consume('RPAREN');

            return expression;
        },
        NOT: (parser) => {
            parser.consume('NOT');

            return {
                type: 'UNARY_EXPRESSION',
                operator: 'NOT',
                argument: ParserWhere.#parseExpression(parser, 10),
            };
        },
        NUMBER: (parser) => {
            return {
                type: 'LITERAL',
                value: parser.consume('NUMBER').value,
            };
        },
        STRING: (parser) => {
            return {
                type: 'LITERAL',
                value: parser.consume('STRING').value,
            };
        },
        BOOLEAN: (parser) => {

            return {
                type: 'LITERAL',
                value: parser.consume('BOOLEAN').value,
            };
        },
        IDENT: (parser) => {
            return ParserWhere.#parseIdentifier(parser);
        },
    }

    static match(parser) {
        if (parser.match('WHERE'))
            return this.apply(parser);

        return null;
    }

    static apply(parser) {
        parser.consume('WHERE');
        return this.#parseExpression(parser);
    }

    static #parseExpression(parser) {
        return {
            type: '', // COMPARISON_EXPRESSION || LOGICAL_EXPRESSION
            operator: '', // AND || OR || ==, !=, ...
            left: null,
            right: null,
        };
    }
}