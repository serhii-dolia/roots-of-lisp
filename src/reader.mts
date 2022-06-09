import { list, QUOTE_SYMBOL, symbol } from "./helper.mjs";
import { List, LispType } from "./types.mjs";

export const read_str = (_: string) => read_form(new Reader(tokenize(_)));

export const read_str_bulk = (_: string) =>
  read_form_bulk(new Reader(tokenize(_)));

const EOF = "EOF";
const LEFT_PAREN = "(";
const RIGHT_PAREN = ")";

class Reader {
  private currentPosition = 0;
  public eof: boolean = false;
  constructor(private tokens: string[]) {}
  next(): string {
    if (this.eof) {
      return EOF;
    }
    this.currentPosition++;
    if (this.currentPosition >= this.tokens.length) {
      this.eof = true;
      return EOF;
    }
    return this.peek();
  }
  peek(): string {
    if (this.eof) {
      return EOF;
    }
    return this.tokens[this.currentPosition];
  }
}

const tokenize = (_: string) => {
  return _.split(/[\s,]*([()']|[^\s\[\]{}('"`,;)]*)/).filter((_) => _ !== "");
};

const read_form_bulk = (_: Reader): LispType[] => {
  const elements: LispType[] = [];
  while (!_.eof) {
    switch (_.peek()) {
      case LEFT_PAREN:
        elements.push(read_list(_));
        _.next();
        continue;
      case "'":
        elements.push(read_quote(_));
        _.next();
        continue;
      default:
        elements.push(symbol(_.peek()));
        _.next();
        continue;
    }
  }
  return elements;
};

const read_form = (_: Reader): LispType => {
  switch (_.peek()) {
    case LEFT_PAREN:
      return read_list(_);
    case "'":
      return read_quote(_);
    default:
      return symbol(_.peek());
  }
};

const read_list = (_: Reader): List => {
  let currentSymbol = _.next();
  let currentValue = read_form(_);
  // case for the empty lists
  if (currentValue.value === RIGHT_PAREN) {
    return list([]);
  }
  const values = [currentValue];
  while (currentValue.value !== RIGHT_PAREN) {
    currentSymbol = _.next();
    if (currentSymbol === EOF) {
      throw new Error(EOF);
    }
    if (currentSymbol === RIGHT_PAREN) {
      break;
    }
    currentValue = read_form(_);
    values.push(currentValue);
  }
  return list(values);
};

const read_quote = (_: Reader): List => {
  _.next();
  return list([QUOTE_SYMBOL, read_form(_)]);
};
