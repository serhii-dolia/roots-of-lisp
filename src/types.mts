export const SYMBOL: unique symbol = Symbol("symbol");
export const LIST: unique symbol = Symbol("list");
export const FUNC: unique symbol = Symbol("func");

export type LispType = List | LispSymbol | Func;

export type List = {
  type: typeof LIST;
  value: LispType[];
};

export type LispSymbol = {
  type: typeof SYMBOL;
  value: string;
};

export type Func = {
  type: typeof FUNC;
  value: FuncPrimitive;
};

export type FuncPrimitive = (...args: LispType[]) => LispType;
