import {
  Func,
  FUNC,
  LispSymbol,
  LispType,
  LIST,
  List,
  SYMBOL,
} from "./types.mjs";

export const bool = (_: boolean): typeof T_SYMBOL | typeof F_SYMBOL =>
  _ ? T_SYMBOL : F_SYMBOL;

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

export const isEmpty = (_: List | List["value"]): boolean => {
  if ("type" in _) {
    return _.value.length === 0;
  }
  return _.length === 0;
};
export const QUOTE_SYMBOL = symbol("quote");

export const T_SYMBOL = symbol("t");

export const F_SYMBOL = list([]);
