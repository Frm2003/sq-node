import CreateTable from '../../ddl/CreateTable.js';
import DataStorage from '../DataStorage.js';
import FileService from './FileService.js';
import SchemaBuilder from './SchemaBuilder.js';
import RowMapper from './RowMapper.js';

export default class FileIngestionPipeline {

    static async run() {
        const fileNames = await FileService.readDir();

        // POR AGORA, SÓ FUNCIONA PARA ARRAY
        for (const fileName of fileNames) {
            const json = this.#normalizeJson(await FileService.readFIle(fileName));

            const tableName = this.#normalizeName(fileName);

            const schemas = SchemaBuilder.handleArray(tableName, json);

            for (const [name, schema] of Object.entries(schemas.tables)) {
                CreateTable.execute(name, schema);
            }

            const rows = RowMapper.extractRowsFromArray(tableName, schemas, json);

            console.log(rows);

            DataStorage.insertMany(rows);
        }
    }

    static #normalizeJson(json) {
        if (!Array.isArray(json)) {
            return [json];
        }

        return json;
    }

    static #normalizeName(fileName) {
        return fileName.replace(/^\d+(_\d+)*_/, '').replace(/\.json$/, '');
    }
}