import { join } from 'path';
import ParserUtils from '../ParserUtils.js';

export default class ParserJoin {

    static match(parser) {
        if (parser.match('JOIN'))
            return this.apply(parser);

        return [];
    }

    static apply(parser, joins = []) {
        parser.consume('JOIN');

        const table = parser.consume('IDENT');

        parser.consume('ON');

        const left = ParserUtils.parseColumn(parser);
        const operation = parser.consume('OP');
        const right = ParserUtils.parseColumn(parser);

        joins.push({
            table: table.value,
            on: { left, operation: operation.value, right }
        });

        if (parser.peek()?.type !== 'JOIN')
            return joins;

        return join(parser, joins);
    }
}