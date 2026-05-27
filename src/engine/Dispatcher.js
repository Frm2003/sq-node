import Select from './dml/Select.js';
import Insert from './dml/Insert.js';

export default class Dispatcher {
    static #statementsMap = new Map([
        ['SELECT', new Select()],
        ['INSERT', new Insert()],
    ]);

    static execute(ast) {
        new Dispatcher().executeQuery(ast);
    }

    executeQuery(ast) {
        const statement = this.#statementsMap.get(ast.type);

        if (!statement)
            throw new Error(`Operação não encontrada para ${ast.type}`);

        console.log(statement.execute(ast));
    }
}