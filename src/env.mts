import { LispSymbol, LispType } from "./types.mjs";

export class Env {
  private data: { [key: string]: LispType } = {};

  constructor(
    private outer: Env | null,
    binds: LispSymbol[] = [],
    exprs: LispType[] = []
  ) {
    for (let i = 0; i < binds.length; i++) {
      this.data[binds[i].value] = exprs[i];
    }
  }

  set(symbol: string, value: LispType) {
    this.data[symbol] = value;
  }

  find(symbol: string): Env | null {
    if (this.data[symbol]) {
      return this;
    }
    if (this.outer === null) {
      return null;
    }
    return this.outer.find(symbol);
  }

  get(symbol: string): LispType {
    const env = this.find(symbol);
    if (!env) {
      throw new Error(`'${symbol}' not found`);
    }
    return env.data[symbol];
  }
}
