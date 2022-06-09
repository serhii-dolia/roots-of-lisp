import { FUNC, LispType, LIST, SYMBOL } from "./types.mjs";

export const pr_str = (_: LispType): string => {
  switch (_.type) {
    case SYMBOL:
      return _.value;
    case LIST:
      return _.value.map(pr_str).join(" ");
    case FUNC:
      return "#<function>";
  }
};
