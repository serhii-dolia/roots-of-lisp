import { FUNC, LIST, SYMBOL, } from "./types.mjs";
export const bool = (_) => _ ? T_SYMBOL : F_SYMBOL;
export const list = (value) => ({
    type: LIST,
    value,
});
export const symbol = (value) => ({
    type: SYMBOL,
    value,
});
export const func = (value) => ({
    type: FUNC,
    value,
});
export const isEmpty = (_) => {
    if ("type" in _) {
        return _.value.length === 0;
    }
    return _.length === 0;
};
export const QUOTE_SYMBOL = symbol("quote");
export const T_SYMBOL = symbol("t");
export const F_SYMBOL = list([]);
