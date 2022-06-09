//@ts-ignore
import * as readline from "node:readline/promises";
//@ts-ignore
import { stdin as input, stdout as output } from "node:process";
//@ts-ignore
import * as fs from "node:fs";
import { read_str, read_str_bulk } from "./reader.mjs";
import {
  FUNC,
  FuncPrimitive,
  LispSymbol,
  LispType,
  LIST,
  List,
  SYMBOL,
} from "./types.mjs";
import {
  bool,
  func,
  F_SYMBOL,
  is_empty,
  list,
  symbol,
  T_SYMBOL,
} from "./helper.mjs";
import { Env } from "./env.mjs";
import { pr_str } from "./printer.mjs";

const rl = readline.createInterface({ input, output });

const car = (_: List): LispType => _.value[0];

const cdr = (_: List): List => list(_.value.slice(1));

// list starts with Symbol lambda
const create_lambda = (_: List, env: Env) => {
  const [params, expr] = _.value.slice(1) as [List, LispType];
  return func((..._: LispType[]) =>
    EVAL(expr, new Env(env, params.value as LispSymbol[], _))
  );
};

const READ = (_: string): LispType => read_str(_);

const EVAL = (_: LispType, env: Env): LispType => {
  switch (_.type) {
    case LIST: {
      if (is_empty(_)) {
        return _;
      }
      const { value } = _.value[0];
      switch (value) {
        case "quote":
          return _.value[1];

        case "cond":
          const pairs = _.value.slice(1) as List[];
          for (const pair of pairs) {
            const res = EVAL(pair.value[0], env);
            if (res.type === SYMBOL && res.value === T_SYMBOL.value) {
              return EVAL(pair.value[1], env);
            }
          }
          return F_SYMBOL;

        case "lambda": {
          return create_lambda(_, env);
        }

        case "label": {
          const [, varName, varValue] = _.value as [
            LispSymbol,
            LispSymbol,
            List
          ];
          const evaluatedValue = EVAL(varValue, env);
          env.set(varName.value, evaluatedValue);
          return evaluatedValue;
        }

        case "defun": {
          const [, funName, args, body] = _.value as [
            LispSymbol,
            LispSymbol,
            List,
            List
          ];
          const f = func((..._: LispType[]) =>
            EVAL(body, new Env(env, args.value as LispSymbol[], _))
          );
          env.set(funName.value, f);
          return f;
        }

        default:
          const evaluatedList = list(_.value.map((v) => EVAL(v, env)));
          let firstElement = evaluatedList.value[0];
          if (firstElement.type !== FUNC) {
            if (firstElement.type !== LIST) {
              throw new Error("expected function or list with lambda");
            }
            if (firstElement.value[0].value !== "lambda") {
              throw new Error("not a function. expected list with lambda");
            }
            firstElement = create_lambda(firstElement, env);
          }
          return firstElement.value(...evaluatedList.value.slice(1));
      }
    }
    case SYMBOL:
      return env.get(_.value);
    default:
      return _;
  }
};

const REPL_ENV = new Env(null);
REPL_ENV.set(
  "atom",
  func((_: LispType) => {
    switch (_.type) {
      case LIST:
        return bool(is_empty(_));
      default:
        return T_SYMBOL;
    }
  })
);

REPL_ENV.set(
  "eq",
  func(
    (
      { type: type1, value: value1 }: LispType,
      { type: type2, value: value2 }: LispType
    ) => {
      if (type1 !== type2) {
        return F_SYMBOL;
      }
      return type1 === LIST
        ? bool(is_empty(value1) && is_empty(value2 as List["value"]))
        : bool(value1 === value2);
    }
  )
);

REPL_ENV.set("car", func(car as FuncPrimitive));
REPL_ENV.set("cdr", func(cdr as FuncPrimitive));
REPL_ENV.set("caar", func(((_: List) => car(car(_) as List)) as FuncPrimitive));
REPL_ENV.set("cadr", func(((_: List) => car(cdr(_))) as FuncPrimitive));
REPL_ENV.set("caddr", func(((_: List) => car(cdr(cdr(_)))) as FuncPrimitive));
REPL_ENV.set(
  "caddar",
  func(((_: List) => car(cdr(cdr(car(_) as List)))) as FuncPrimitive)
);
REPL_ENV.set(
  "cadar",
  func(((_: List) => car(cdr(car(_) as List))) as FuncPrimitive)
);

REPL_ENV.set(
  "cons",
  func(((arg1: LispSymbol, arg2: List) =>
    list([arg1, ...arg2.value])) as FuncPrimitive)
);

REPL_ENV.set(
  "load-file",
  func(((arg: LispSymbol) => {
    const elements = read_str_bulk(
      fs.readFileSync(arg.value, { encoding: "utf-8" })
    );
    elements.map((e) => EVAL(e, REPL_ENV));

    return symbol("done");
  }) as FuncPrimitive)
);

const PRINT = (_: LispType) => pr_str(_);

const rep = (_: string) => PRINT(EVAL(READ(_), REPL_ENV));

const start = async () => {
  while (true) {
    try {
      console.log(rep(await rl.question("input> ")));
    } catch (e: any) {
      console.log(e.message);
      await start();
    }
  }
};

start();
