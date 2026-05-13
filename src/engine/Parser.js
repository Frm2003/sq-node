import ParserSelect from './ParserSelect.js';

export default class Parser {
    #tokens;
    #current = 0;

    static #parserMap = new Map([
        ['SELECT', new ParserSelect()],
    ]);

    constructor(tokens) {
        this.#tokens = tokens;
    }

    static transform(tokens) {
        return new Parser(tokens).#parseStatement();
    }

    #parseStatement() {
        const token = this.peek();

        const statementParser = Parser.#parserMap.get(token.type);

        if (!statementParser) {
            throw new Error(`Parser não encontrado para ${token.type}`);
        }

        return statementParser.parse(this);
    }

    accept(type) {
        if (this.peek()?.type === type) {
            return this.consume(type);
        }
        return null;
    }

    consume(...types) {
        const token = this.peek();

        if (!token || !types.includes(token.type))
            throw new Error(`Esperado ${types.join(' | ')}, encontrado ${token?.type}`);

        this.#current++;

        return token;
    }

    peek() {
        return this.#tokens[this.#current];
    }
}