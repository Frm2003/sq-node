import fs from 'fs/promises';
import path from 'path';

export default class FileService {
    static #path = path.join(process.cwd(), 'jsons');

    static async readDir(dirPath = this.#path) {
        const dirHandle = await fs.opendir(dirPath);

        const files = [];

        for await (const entry of dirHandle) {
            if (!entry.isFile()) continue;
            files.push(entry.name);
        }

        return files;
    }

    static async readFIle(fileName) {
        try {
            const fullPath = path.resolve(this.#path, fileName);
            const data = await fs.readFile(fullPath, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
    }
}