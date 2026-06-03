import ParserJoin from '../clauses/ParserJoin.js';
import ParserWhere from '../clauses/ParserWhere.js';

export default class Select {
    parse(parser) {
        parser.consume('SELECT');

        const columns = this.#parseColumns(parser);

        parser.consume('FROM');

        const table = parser.consume('IDENT');

        return {
            type: 'SELECT',
            table: table.value,
            columns,
            joins: ParserJoin.match(parser),
            predicateTree: ParserWhere.match(parser),
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