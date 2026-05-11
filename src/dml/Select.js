import DataStorage from '../core/DataStorage.js';
import WhereEvaluator from '../query/WhereEvaluator.js';
import Projection from '../query/Projection.js';

export default class Select {
    static execute(query) {
        const table = DataStorage.getTable(query.tableName);
        const rows = WhereEvaluator.apply(table, query.where);

        const fields = query.fields.includes('*')
            ? Object.keys(rows[0] ?? table[0] ?? {})
            : query.fields;

        return Projection.project(rows, fields);
    }
}