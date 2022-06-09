import { Func, FUNC, LispSymbol, LIST, List, SYMBOL } from "./types.mjs";

export const bool = (_: boolean) => (_ ? T_SYMBOL : F_SYMBOL);

export const list = (value: List["value"]): List => ({
  type: LIST,
  value,
});
export const symbol = (value: LispSymbol["value"]): LispSymbol => ({
  type: SYMBOL,
  value,
});
export const func = (value: Func["value"]): Func => ({
  type: FUNC,
  value,
});

export const is_empty = (_: List | List["value"]): boolean => {
  if ("type" in _) {
    return _.value.length === 0;
  }
  return _.length === 0;
};
export const QUOTE_SYMBOL = symbol("quote");

export const T_SYMBOL = symbol("t");

export const F_SYMBOL = list([]);
