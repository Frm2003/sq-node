export default class Lexer {
    static #KEYWORDS = [
        'SELECT',
        'FROM',
        'WHERE',
        'NULL',
        'AND',
        'OR',
        'NOT',
        'INSERT',
        'UPDATE',
        'DELETE',
        'JOIN'
    ];

    static #OPERATORS = [
        '!=',
        '>=',
        '<=',
        '==',
        '>',
        '<'
    ];

    static #PUNCTUATION = {
        ',': 'COMMA',
        '(': 'LPAREN',
        ')': 'RPAREN',
        ';': 'SEMICOLON',
        '{': 'LBRACE',
        '}': 'RBRACE',
        ':': 'COLON',
        '.': 'DOT',
        '*': 'STAR',
    };

    static #ruleset = [
        // espaços
        {
            type: 'WHITESPACE',
            match: /^\s+/,
            ignore: true
        },

        // keywords
        ...this.#KEYWORDS.map(keyword => ({
            type: keyword,
            match: new RegExp(`^${keyword}\\b`, 'i')
        })),

        // operadores
        {
            type: 'OP',
            match: new RegExp(
                '^(' +
                this.#OPERATORS
                    .sort((a, b) => b.length - a.length)
                    .map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                    .join('|') +
                ')'
            )
        },

        // pontuação
        ...Object.entries(this.#PUNCTUATION).map(([symbol, type]) => ({
            type,
            match: new RegExp(
                '^' + symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            )
        })),

        // literais
        {
            type: 'NUMBER',
            match: /^\d+(\.\d+)?/
        },

        {
            type: 'STRING',
            match: /^([''])(?:\\.|(?!\1).)*\1/
        },
        {
            type: "BOOLEAN",
            match: /^(true|false)\b/i
        },
        // identificadores
        {
            type: 'IDENT',
            match: /^[a-zA-Z_]\w*/
        },
    ];

    static tokenizer(input) {
        const tokens = [];

        let i = 0;

        while (i < input.length) {
            const slice = input.slice(i);

            const { rule, value, length } = this.#matchRule(slice);

            if (!rule)
                throw new Error(`Token inválido em: '${slice[0]}'`);

            if (!rule.ignore)
                tokens.push({ type: rule.type, value });

            i += length;
        }

        return tokens;
    }

    static #matchRule(slice) {
        for (const rule of this.#ruleset) {
            const regex = rule.match;

            const matched = slice.match(regex);

            if (!matched) continue;

            const value = matched[0];

            return {
                rule,
                value,
                length: value.length
            }
        }

        return null;
    }
}