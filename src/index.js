import readline from 'readline';

import FileIngestionPipeline from './engine/core/pipe/FileIngestionPipeline.js';
import Parser from './parser/Parser.js';

await FileIngestionPipeline.run();

const start = () => {
    const ast = Parser.transform(`
        SELECT profile.*, users.active
        FROM users
            JOIN profile ON users.id == profile.users_id
        WHERE users.active == false AND users.id > 1`
    );
};

start();


// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// function perguntar() {
//     console.clear();
    
//     rl.question(':', (arg) => {
//         console.clear();
//         console.log(arg);
//         Dispatcher.execute(arg);
//         rl.question('Pressione Enter para continuar...', () => {
//             perguntar();
//         });
//     });
// }

// perguntar();
