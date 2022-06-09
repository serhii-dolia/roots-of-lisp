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
export const list = (value: LispType[]): List => ({
  type: LIST,
  value,
});
export const symbol = (value: string): LispSymbol => ({
  type: SYMBOL,
  value,
});
export const func = (value: Func["value"]): Func => ({
  type: FUNC,
  value,
});

export const QUOTE_SYMBOL = symbol("quote");

export const T_SYMBOL = symbol("t");

export const F_SYMBOL = list([]); //symbol("f");
