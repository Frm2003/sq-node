import DataStorage from './core/DataStorage.js';
import Select from './dml/Select.js';
import FileIngestionPipeline from './pipe/FileIngestionPipeline.js';

await FileIngestionPipeline.run();

console.log(Select.execute({
    tableName: 'users',
    fields: ['nome', 'email'],
    where: [
        {
            field: 'nome',
            operator: '!=',
            value: null,
        }
    ]
}));
