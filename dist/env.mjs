export class Env {
    outer;
    data = {};
    constructor(outer, binds = [], exprs = []) {
        this.outer = outer;
        for (let i = 0; i < binds.length; i++) {
            this.data[binds[i].value] = exprs[i];
        }
    }
    set(symbol, value) {
        this.data[symbol] = value;
    }
    find(symbol) {
        if (this.data[symbol]) {
            return this;
        }
        if (this.outer === null) {
            return null;
        }
        return this.outer.find(symbol);
    }
    get(symbol) {
        const env = this.find(symbol);
        if (!env) {
            throw new Error(`'${symbol}' not found`);
        }
        return env.data[symbol];
    }
}
