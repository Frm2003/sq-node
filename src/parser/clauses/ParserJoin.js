import ParserUtils from '../ParserUtils.js';

export default class ParserJoin {
    static apply(parser) {
        const joins = [];

        while (true) {
            const table = parser.consume('IDENT');

            parser.consume('ON');

            const left = ParserUtils.parseColumn(parser);
            const operation = parser.consume('OP');
            const right = ParserUtils.parseColumn(parser);

            joins.push({
                table: table.value,
                on: {
                    left,
                    operation: operation.value,
                    right,
                }
            });

            if (parser.peek()?.type !== 'JOIN')
                break;

            parser.consume('JOIN');
        }

        return joins;
    }
}