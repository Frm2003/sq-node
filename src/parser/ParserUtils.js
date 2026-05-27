export default class ParserUtils {

    static parseColumn(parser) {
        const table = parser.consume('IDENT');
        parser.consume('DOT');
        const column = parser.consume('IDENT');

        return {
            table: table.value,
            column: column.value,
        }
    }

    static parseValue(token) {
        if (token.type === 'BOOLEAN')
            return token.value === 'true';

        if (token.type === 'NUMBER')
            return Number(token.value);

        if (token.type === 'STRING')
            return token.value;

        return token.value;
    }
}