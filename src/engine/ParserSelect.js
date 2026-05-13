import JoinEvaluator from './JoinEvaluator.js';
import WhereEvaluator from './WhereEvaluator.js';

export default class ParserSelect {
    parse(parser) {
        parser.consume('SELECT');

        const columns = this.#parseColumns(parser);

        parser.consume('FROM');

        const table = parser.consume('IDENT');

        let conditionals = [];

        if (parser.accept('JOIN')) {
            joins = JoinEvaluator.apply(parser);
        }

        if (parser.accept('WHERE'))
            conditionals = WhereEvaluator.parseExpression(parser);

        return {
            type: 'SELECT',
            columns,
            table: table.value,
            conditionals,
        };
    }

    #parseColumns(parser) {
        const columns = [];

        while (true) {
            const table = parser.consume('IDENT');

            parser.consume('DOT');

            const type = parser.consume('IDENT', 'STAR');

            if (type.value === '*') {
                columns.push({ type: 'wildcard', table: table.value });
            } else {
                columns.push({ type: 'field', table: table.value, column: type.value });
            }

            if (parser.peek()?.type !== 'COMMA')
                break;

            parser.consume('COMMA');
        }

        return columns;
    }
}