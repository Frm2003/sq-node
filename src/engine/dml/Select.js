import DataStorage from '../core/DataStorage.js';
import SchemaStorage from '../core/SchemaStorage.js';
import JoinEvaluator from '../evaluators/JoinEvaluator.js';
import WhereEvaluator from '../evaluators/WhereEvaluator.js';
import ColumnarProjection from '../operators/ColumnarProjection.js';

export default class Select {
    execute(ast) {
        const fields = this.#extractFields(ast.table, ast.joins, ast.columns);

        const parentRows = DataStorage.getTable(ast.table);
        const joinedRows = JoinEvaluator.apply(parentRows, ast.joins);

        const rows = WhereEvaluator.apply(joinedRows, ast.predicateTree);

        return ColumnarProjection.project(rows, fields);
    }

    // EXTRAIR CAMPOS DIRETO DOS SCHEMAS
    #extractFields(table, joins = [], columns) {
        const context = new Map();

        context.set(table, SchemaStorage.getTable(table));

        for (const join of joins) {
            context.set(join.table, SchemaStorage.getTable(join.table));
        }

        const fields = [];

        for (const { column, table: tableName, type } of columns) {

            if (type === 'field') {
                fields.push({ table: tableName, column });
                continue;
            }

            if (type === 'wildcard') {
                const { columns } = context.get(tableName);

                for (const key of Object.keys(columns)) {
                    fields.push({ table: tableName, column: key });
                }
            }
        }

        return fields;
    }
}