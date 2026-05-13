import Select from '../dml/Select.js';
import Lexer from './Lexer.js';
import Parser from './Parser.js';

export default class Dispatcher {
    #ddlMap = new Map([
        ['SELECT', new Select()]
    ]);

    static execute(arg) {
        const tokens = Lexer.tokenizer(arg);
        const ast = Parser.transform(tokens);
        new Dispatcher().executeQuery(ast);
    }

    executeQuery(ast) {
        const ddl = this.#ddlMap.get(ast.type);

        if (!ddl) {
            throw new Error(`Operação não encontrada para ${ast.type}`);
        }

        console.log(ddl.execute(ast));
    }
}