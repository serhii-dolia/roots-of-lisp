export const SYMBOL = Symbol("symbol");
export const LIST = Symbol("list");
export const FUNC = Symbol("func");
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
export const QUOTE_SYMBOL = symbol("quote");
export const T_SYMBOL = symbol("t");
export const F_SYMBOL = list([]); //symbol("f");
