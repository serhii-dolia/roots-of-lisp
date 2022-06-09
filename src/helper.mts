import { F_SYMBOL, T_SYMBOL } from "./types.mjs";

export const bool = (_: boolean): typeof T_SYMBOL | typeof F_SYMBOL =>
  _ ? T_SYMBOL : F_SYMBOL;
