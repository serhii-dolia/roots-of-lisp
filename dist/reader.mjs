import { QUOTE_SYMBOL, symbol, list } from "./types.mjs";
export const read_str = (_) => read_form(new Reader(tokenize(_)));
export const read_str_bulk = (_) => read_form_bulk(new Reader(tokenize(_)));
const EOF = "EOF";
const LEFT_PAREN = "(";
class Reader {
    tokens;
    currentPosition = 0;
    eof = false;
    constructor(tokens) {
        this.tokens = tokens;
    }
    next() {
        if (this.eof) {
            return EOF;
        }
        this.currentPosition++;
        if (this.currentPosition >= this.tokens.length) {
            this.eof = true;
            return EOF;
        }
        return this.peek();
    }
    peek() {
        if (this.eof) {
            return EOF;
        }
        return this.tokens[this.currentPosition];
    }
}
const tokenize = (_) => {
    return _.split(/[\s,]*([()']|[^\s\[\]{}('"`,;)]*)/).filter((_) => _ !== "");
};
const read_form_bulk = (_) => {
    const elements = [];
    while (!_.eof) {
        switch (_.peek()) {
            case LEFT_PAREN:
                elements.push(read_list(_));
                _.next();
                continue;
            case "'":
                elements.push(read_quote(_));
                _.next();
                continue;
            default:
                elements.push(symbol(_.peek()));
                _.next();
                continue;
        }
        _.next();
    }
    return elements;
};
const read_form = (_) => {
    switch (_.peek()) {
        case LEFT_PAREN:
            return read_list(_);
        case "'":
            return read_quote(_);
        default:
            return symbol(_.peek());
    }
};
const read_list = (_) => {
    let currentSymbol = _.next();
    let currentValue = read_form(_);
    // case for the empty lists
    if (currentValue.value === ")") {
        return list([]);
    }
    const values = [currentValue];
    while (currentValue.value !== ")") {
        currentSymbol = _.next();
        if (currentSymbol === EOF) {
            throw new Error(EOF);
        }
        currentValue = read_form(_);
        if (currentValue.value === ")") {
            break;
        }
        values.push(currentValue);
    }
    return list(values);
};
const read_quote = (_) => {
    _.next();
    return list([QUOTE_SYMBOL, read_form(_)]);
};
